# Tarefa 5.0: Integração do Service Worker e App Manifest (Vite PWA)

## Visão Geral

Integrar o `vite-plugin-pwa` no build do Vite para gerar o `manifest.json` e registrar o Service Worker encarregado do cache estático e interceptação de rede.

<skills>
### Conformidade com Skills

- `execute-task`: Para configuração do build PWA.
- `tester`: Para validação estática e unitária das configurações.
</skills>

<rules>
### Conformidade com Rules

- `user_global`: Integridade na configuração, garantindo que regras de cache não quebrem sessões antigas abruptamente.
</rules>

<requirements>
- Instalar `vite-plugin-pwa`.
- Configurar o plugin dentro de `vite.config.ts` especificando:
  - Detalhes do `manifest.json` (nome, cores, display `standalone`, ícones).
  - Estratégias do Workbox para cache de assets do App Shell.
- Inserir componentes/hooks necessários (ex: `useRegisterSW`) para alertar o usuário de novas versões (se aplicável, ou auto-update).
</requirements>

## Subtarefas

- [ ] 5.1 Instalar o `vite-plugin-pwa`.
- [ ] 5.2 Adicionar ícones básicos na pasta `public/` do app para o manifest.
- [ ] 5.3 Configurar o `VitePWA` no `vite.config.ts` com a definição do manifest e opções do Workbox (generateSW).
- [ ] 5.4 Adicionar registro do service worker na entrada principal (ex: `main.tsx`).

## Detalhes de Implementação

Consultar a seção "Sequenciamento de Desenvolvimento" (Passo 5) e "Considerações Técnicas" em `techspec.md`.

## Critérios de Sucesso

- Um build de produção (`pnpm --filter pwa build`) gera com sucesso os arquivos `sw.js` (ou similar) e `manifest.webmanifest`.
- No ambiente de desenvolvimento (e via preview), a aplicação é reconhecida pelo Lighthouse como instalável (Installable).

## Testes da Tarefa

- [x] Testes de unidade (Validação de build estático sem erros)
- [ ] Testes de integração
- [ ] Testes E2E (Será coberto na Tarefa 6)

## Arquivos relevantes

- `apps/pwa/vite.config.ts`
- `apps/pwa/src/main.tsx`
- `apps/pwa/public/*`
