# Estado do Projeto – Centro Financeiro Social

> Última atualização: 2026-03-29
> Branch: master

## Visão Geral

O projeto é uma aplicação de gerenciamento financeiro monorepo com backend em NestJS (Prisma/PostgreSQL) e frontend em React (Vite/TypeScript). O foco é o controle de despesas pessoais, de casal e em grupo, com um design "Editorial Finance" de alta fidelidade ao Figma.

Atualmente, o projeto concluiu a fundação de infraestrutura, autenticação, transações multi-contexto (pessoal/casal/grupo) e consolidou a base do redesign com um Design System atômico orientado por tokens.

## Features Implementadas

### Fundação, Autenticação e Infraestrutura
- **O que foi feito**: Setup do monorepo, backend NestJS, frontend React. Autenticação JWT completa, incluindo registro, login e fluxo de recuperação de senha. Padronização de workflows de agente (Research -> Strategy -> Execution).
- **Arquivos principais**: `backend/src/auth/`, `frontend/src/features/auth/`, `~/.gemini/GEMINI.md`.
- **Notas**: Uso de Prisma para persistência e TanStack Query para estado do frontend.

### Transações Multi-Contexto (Épico 2, 3 e 4)
- **O que foi feito**: Modelagem e implementação de transações Pessoais, de Casal (com split configurável) e de Grupo (com acertos/settlements). Endpoints de balanço e resumo agregados.
- **Arquivos principais**: `backend/src/transactions/`, `backend/src/couple/`, `backend/src/groups/`.
- **Notas**: O contrato de transações suporta os 3 modos (`PERSONAL`, `COUPLE`, `GROUP`) de forma unificada.
- **Atualização recente**: `/transactions` agora exige o campo `direction` (INCOME/EXPENSE), oferece pesquisa textual, filtros de data e paginação com metadados. O dashboard (`GET /dashboard`) consome os mesmos dados, inclui a lista detalhada de grupos (`groups.items`) e respeita `direction` nos cálculos e `recentTransactions`.

### Design System e Redesign de Páginas (Épico 5)
- **O que foi feito**: Implementação de tokens de design (Figma), componentes atômicos (`Button`, `Input`, `Card`, `Badge`) e biblioteca de ícones SVG. Redesign total da `HomePage` (Dashboard Global) e da `PersonalPage` (Visão Pessoal Detalhada).
- **Arquivos principais**: `frontend/src/design-system/`, `frontend/src/features/dashboard/HomePage.tsx`, `frontend/src/features/personal/PersonalPage.tsx`.
- **Notas**: Fidelidade visual "pixel-perfect" ao Figma; uso rigoroso de CSS Variables. O componente `Badge` foi atualizado para suportar `className` customizado.

### Token Pipeline e Alinhamento Global de CSS
- **O que foi feito**: `frontend/src/design-system/tokens.json` passou a ser a fonte única de verdade para estilos tokenizáveis. Foi criado um gerador estático de variáveis CSS (`frontend/scripts/generate-css-tokens.mjs`) que produz `frontend/src/design-system/tokens.css`, agora importado pelo `frontend/src/index.css`. Todos os arquivos CSS atuais do frontend foram migrados para consumir tokens gerados ou aliases legados compatíveis.
- **Arquivos principais**: `frontend/src/design-system/tokens.json`, `frontend/src/design-system/tokens.css`, `frontend/scripts/generate-css-tokens.mjs`, `frontend/src/index.css`, `frontend/src/features/dashboard/HomePage.css`, `frontend/src/features/personal/PersonalPage.css`.
- **Notas**: O `index.css` deixou de ser a origem de valores e passou a funcionar como camada de compatibilidade para variáveis legadas (`--color-*`, `--space-*`, etc.) ainda usadas por CSS e por estilos inline em componentes TSX.

## Onde o Desenvolvimento Parou

- **Em progresso**: Aperfeiçoar experiências complementares como modais de cadastro e recursos responsivos; o Dashboard e a PersonalPage já consomem `/dashboard` real com novos blocos de dados e `recentTransactions`.
- **Próximos passos**:
  1. Implementar formulários funcionais para criação de transações (`TransactionForm.tsx`).
  2. Expandir filtros/páginas de transações com paginação completa na IU.
  3. Documentar fluxos de `Income` versus `Expense` para os usuários.
  4. Ativar testes end-to-end para novos componentes (Dashboard e formulário).
- **Pendências**:
  - Responsividade permanece parcial (foco desktop).
  - Edição/Exclusão de grupos e transações na IU.
  - Testes e2e automatizados ainda pendentes.

## Endpoints / APIs (Estado Atual)

- **Implementados**: 
  - `POST /auth/register`, `/login`, `/forgot-password`, `/reset-password`.
  - `POST/GET /transactions`.
  - `POST/GET /couple`, `/groups`, `/groups/:id/balance`.
  - `GET /dashboard` (Real).
- **A implementar**: Filtros avançados na IU, exportação de CSV/PDF.

## Estrutura de Arquivos Relevantes

```text
/
├── backend/src/       # NestJS Modules (auth, users, transactions, couple, groups, dashboard)
├── frontend/src/
│   ├── design-system/ # Atomic Components, tokens.json e tokens.css gerado
│   ├── features/      # Business features (dashboard, personal, auth, groups)
│   ├── App.tsx        # Routing & Layout
│   └── index.css      # Resets + aliases legados apontando para tokens gerados
├── frontend/scripts/  # Scripts utilitários do frontend (ex: geração de tokens CSS)
├── scripts/           # Scripts utilitários globais (ex: limpeza de cache Gemini)
└── docs/              # PRD, Guidelines, Prompts
```

## Useful Commands

```bash
# Iniciar ambiente de desenvolvimento
cd backend && npm run start:dev
cd frontend && npm run dev

# Gerar variáveis CSS a partir dos tokens
cd frontend && npm run tokens:build

# Verificações executadas com sucesso após o alinhamento dos tokens
npm run lint:frontend
npm run typecheck:frontend
cd frontend && npm run build

# Sincronização de Banco de Dados
npx prisma migrate dev
npx prisma studio

# Limpeza de caches do Gemini (Google AI Studio)
npm run clean:cache
```

## Convenções e Padrões

- **Padrão de Agente**: Research -> Strategy -> Execution (Research antes de agir).
- **Interface**: "Editorial Finance" (Plus Jakarta Sans para display, Inter para body).
- **Código**: TypeScript obrigatório; CSS focado em tokens e utilitários modernos (Flex/Grid).
- **Design Tokens**: `frontend/src/design-system/tokens.json` is the source of truth; `frontend/src/design-system/tokens.css` is artefato gerado.
- **Compatibilidade CSS**: Variáveis legadas em `frontend/src/index.css` devem apenas referenciar tokens gerados, nunca duplicar valores brutos manualmente.
