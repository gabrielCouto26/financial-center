# Especificação Técnica

## Resumo Executivo

Esta especificação técnica detalha a fundação arquitetural do Progressive Web App (PWA) "Financial Center", focando em uma experiência mobile-first leve e veloz. O sistema será desenvolvido em um novo workspace paralelo (`apps/pwa`) com React, Vite e Tailwind CSS, descartando a UI legada para essa finalidade. Componentes de domínio (tipos TS) e a camada de rede (`apiFetch`) serão extraídos para um pacote `packages/shared`, fomentando reuso. O Service Worker e o gerenciamento de cache (App Shell) serão automatizados via `vite-plugin-pwa` (Workbox). Para garantir uma inicialização instantânea (offline-first), a autenticação e estado básico transicionarão para persistência em IndexedDB, permitindo renderização imediata da estrutura da aplicação antes mesmo da conectividade ser validada.

## Arquitetura do Sistema

### Visão Geral dos Componentes

- **`apps/pwa` (Novo App Frontend)**: Aplicação mobile-first rodando React 19 + Vite. Hospedará as telas, rotas e a interface PWA e gerenciará o layout utilizando Tailwind CSS e utilitários para *safe areas* do iOS/Android.
- **`packages/shared` (Novo Pacote)**: Biblioteca interna do monorepo criada para abrigar tipos TypeScript (`user.ts`, `transaction.ts`, etc.) e o cliente HTTP base (`api.ts`). Ambos serão extraídos do `apps/frontend` atual.
- **PWA Service Worker Manager**: Implementado via `vite-plugin-pwa` (Workbox). Ficará responsável pelo App Shell, precache de assets estáticos e políticas de rede (Network First / Stale-While-Revalidate).
- **Storage Layer (IndexedDB)**: Camada de persistência via `localForage`. Desacopla o token do `localStorage` (síncrono e limitante) para persistir o JWT de forma assíncrona, não travando a thread principal.

## Design de Implementação

### Interfaces Principais

```typescript
// packages/shared/src/api/apiClient.ts
export interface ApiClientConfig {
  baseUrl: string;
  // A recuperação de token agora é Promise-based para suportar IndexedDB
  getToken: () => Promise<string | null>;
  setToken: (token: string) => Promise<void>;
  clearToken: () => Promise<void>;
}

// apps/pwa/src/services/storage.ts
export interface StorageService {
  getAuthToken(): Promise<string | null>;
  setAuthToken(token: string): Promise<void>;
  getUserState(): Promise<UserState | null>;
  setUserState(state: UserState): Promise<void>;
}
```

### Modelos de Dados

- **Configuração do Web App Manifest**: O plugin cuidará da compilação do manifesto, onde deverão estar especificados: `name`, `short_name`, `theme_color`, `background_color`, opções visuais (`display: 'standalone'`) e os ícones adaptáveis.
- **Local User State**: Objeto (ex: `UserState`) guardado no banco do navegador, contendo dados mínimos vitais de sessão para exibir a home imediatamente na ausência de rede (ex: ID e nome do parceiro).

### Endpoints de API

*(A arquitetura consumirá os endpoints REST do backend existente no monorepo sem alterações de estrutura no lado do servidor)*
- `GET /api/auth/me`: Utilizado na montagem do App Shell para revalidar, em segundo plano (background refresh), o JWT persistido no IndexedDB.
- `POST /api/auth/login`: Realimentará a engine de storage (`StorageService`) com novos tokens PWA e hidratará o cache inicial do usuário.

## Pontos de Integração

- **Backend NestJS Existente (`apps/backend`)**: Comunicação garantida através do CORS já configurado. Não haverá alterações no backend nesta fase.
- **Vite PWA Plugin (Workbox)**: O plugin será integrado ao processo de build do Vite para gerar o bundle do Web Worker no deploy de produção (e simulação local).

## Abordagem de Testes

### Testes Unidade
- **`packages/shared`**: Validar o comportamento do novo `apiFetch` modificado, garantindo o devido uso assíncrono para captação do token do `ApiClientConfig` mockado.
- **`apps/pwa` (Storage)**: Testes de unidade da camada de IndexedDB mockando o client para verificar fallback, falhas de I/O de armazenamento local e decodificação do estado.

### Testes de Integração
- **App Shell Mounting**: Assegurar, usando Vitest + React Testing Library, que os componentes Layout e Rotas montam os stubs (skeletons) enquanto o estado de auth assíncrono não carrega.

### Testes de E2E
- **Configuração do Playwright**: O ambiente de teste será levantado com PW (ou na engine Webkit/Chromium mockando os service workers).
- **Cenário 1 (Instalação e Caching)**: Verificar se o Service Worker faz o bypass corretamente e o manifest injeta tags essenciais.
- **Cenário 2 (Offline Startup)**: Bloquear o acesso à rede (simular *Offline mode*). Verificar se a rota exibe o App Shell renderizado a partir do cache e extraindo as informações prévias de usuário do IndexedDB.

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **Monorepo refactoring**: Criar workspace `packages/shared`, configurar `.npmrc` / `tsconfig.json` base. Mover e adaptar o utilitário `api.ts` e pasta `types/` presentes hoje em `apps/frontend/`.
2. **Setup do Workspace `apps/pwa`**: Instalar React, Vite e o TailwindCSS, assegurando que o `pnpm-workspace.yaml` capta a pasta adequadamente.
3. **Módulo Storage & API**: Integrar `localForage` (ou similar wrapper de IndexedDB) e atrelar a leitura de tokens com o client do pacote `shared`.
4. **Fundação Visual & Layout**: Setup do Tailwind para suportar as variáveis `env(safe-area-inset-*)` (`viewport-fit=cover`) a fim de otimizar o topo/inferior para mobile (iOS notch, Android bars).
5. **Integração PWA Workbox**: Adicionar `vite-plugin-pwa`, configurando os ícones e o `manifest.json`.
6. **Implementação de Testes Playwright**: Escrever os cenários E2E (online vs offline) descritos acima provando o App Shell local.

### Dependências Técnicas

- **Reescrita do API Client**: Como no legado o token era captado pelo `localStorage` (síncrono), qualquer mudança para um repositório como o `IndexedDB` obriga a inicialização do app ou do fetch hook ser gerenciada com tratativas assíncronas no contexto global do React.

## Monitoramento e Observabilidade

- **Auditoria Dev**: O uso da aba "Application" do Lighthouse (DevTools) precisará estar integrado nos checks locais, focando estritamente em critérios Installable, PWA Optimized e HTTPS Redirects.
- **Logs do Workbox**: O build de dev deverá habilitar explícitos *debug logs* para observar a política de invalidamento do Service Worker cache e interceptações (fetch event handlers).

## Considerações Técnicas

### Decisões Principais

- **Novo Workspace PWA**: Permite paralelismo e isola a complexidade de transição entre a atual plataforma com Vanilla CSS e a futura utilizando TailwindCSS, mitigando riscos regressivos na base principal.
- **Substituição de `localStorage`**: O `IndexedDB` suporta melhor a natureza não-bloqueante exigida em PWAs e permite persistir estruturas maiores, além de estar amplamente disponível até mesmo para Web Workers sem a restrição do Window DOM.
- **Tailwind `Safe Area` Utilities**: É essencial não criar gaps pretos ou UI sobreposta a hardware components (câmeras, system navigation) de smartphones, validando o requisito central do PRD de ser mobile-first com UX orgânica.

### Riscos Conhecidos

- **Cache Invalidation (Stale Content)**: Sem proper cache busting, os Service Workers tendem a prender o usuário numa build velha. Mitigação via Workbox *AutoUpdate* ou banner manual para reload.
- **Acesso Offline (Token Expiration)**: Se o JWT expirar enquanto offline, o design requer que a UI reconheça a necessidade de login apenas após reconectar, ou forneça bloqueios adequados. Para essa inicialização não trataremos sessões caídas; o App Shell servirá os dados temporários até que haja refresh da API na próxima conexão.

### Conformidade com Rules

- `user_global` - Mantemos total alinhamento com ciclo focado no teste, TypeScript Type Safety e aderência conservadora de regras e arquitetura segura.

### Conformidade com Skills

- `@create-techspec` - Framework base para criação do documento de forma padronizada.
- `@create-tasks` (Próximo Passo Recomendado) - Para traduzir este TechSpec e PRD na granularidade das tarefas finais.

### Arquivos relevantes e dependentes

- Modificações raízes: `pnpm-workspace.yaml`, `package.json`
- Códigos a migrar: `apps/frontend/src/services/api.ts`, `apps/frontend/src/types/*`
- Arquivos contextuais: `tasks/prd-pwa-setup/prd.md`, `docs/contexto_implementacao_pwa.md`
