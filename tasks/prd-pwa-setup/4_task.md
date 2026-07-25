# Tarefa 4.0: Configuração Base de Layout e Estilização (TailwindCSS)

## Visão Geral

Configurar o Tailwind CSS em `apps/pwa` focado em Mobile-First, adicionando utilitários para lidar com "safe areas" e inicializando o esqueleto (App Shell).

<skills>
### Conformidade com Skills

- `execute-task`: Para implementar o TailwindCSS.
- `tester`: Para validar a build e renderização correta das classes utilitárias.
</skills>

<rules>
### Conformidade com Rules

- `user_global`: Nenhuma refatoração não-relacionada a estilização visual no código PWA.
</rules>

<requirements>
- Instalação e configuração do `tailwindcss`, `postcss` e `autoprefixer`.
- Criação do arquivo de configuração `tailwind.config.js` estendendo os design tokens do projeto.
- Configuração do CSS global incluindo meta tags essenciais no `index.html` (`viewport-fit=cover`).
- Criação de classes utilitárias no Tailwind para tratar `env(safe-area-inset-*)`.
- Implementação de um layout base (skeleton) minimalista para representar o App Shell.
</requirements>

## Subtarefas

- [ ] 4.1 Instalar `tailwindcss`, `postcss`, `autoprefixer` no workspace `apps/pwa`.
- [ ] 4.2 Inicializar `tailwind.config.js` e configurar os paths de `content`.
- [ ] 4.3 Inserir diretivas Tailwind e configurações CSS base (safe areas) em `src/index.css`.
- [ ] 4.4 Atualizar `index.html` com as meta tags de viewport adequadas.
- [ ] 4.5 Construir o componente React de Layout (App Shell Skeleton).

## Detalhes de Implementação

Consultar a seção "Sequenciamento de Desenvolvimento" (Passo 4) em `techspec.md`.

## Critérios de Sucesso

- O Tailwind CSS gera o CSS com as classes utilizadas e as variáveis de safe-area.
- O componente Layout é montado sem quebras visuais e respeitando as extremidades de dispositivos mobile.

## Testes da Tarefa

- [ ] Testes de unidade
- [x] Testes de integração (App Shell Mounting - testar se os componentes Layout renderizam os skeletons via React Testing Library)
- [ ] Testes E2E (se aplicável)

## Arquivos relevantes

- `apps/pwa/tailwind.config.js`
- `apps/pwa/postcss.config.js`
- `apps/pwa/src/index.css`
- `apps/pwa/index.html`
- `apps/pwa/src/layout/AppLayout.tsx`
