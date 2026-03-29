# Estado do Projeto – Centro Financeiro Social

> Última atualização: 2026-03-29
> Branch: feature/gemini-flash-3-preview

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

### Design System e Redesign do Dashboard (Épico 5)
- **O que foi feito**: Implementação de tokens de design (Figma), componentes atômicos (`Button`, `Input`, `Card`, `Badge`) e biblioteca de ícones SVG. Redesign total da `HomePage` (Dashboard) e migração da visão anterior para a `PersonalPage`.
- **Arquivos principais**: `frontend/src/design-system/`, `frontend/src/features/dashboard/HomePage.tsx`, `frontend/src/features/personal/PersonalPage.tsx`.
- **Notas**: Fidelidade visual "pixel-perfect" ao Figma; uso rigoroso de CSS Variables.

### Token Pipeline e Alinhamento Global de CSS
- **O que foi feito**: `frontend/src/design-system/tokens.json` passou a ser a fonte única de verdade para estilos tokenizáveis. Foi criado um gerador estático de variáveis CSS (`frontend/scripts/generate-css-tokens.mjs`) que produz `frontend/src/design-system/tokens.css`, agora importado pelo `frontend/src/index.css`. Todos os arquivos CSS atuais do frontend foram migrados para consumir tokens gerados ou aliases legados compatíveis.
- **Arquivos principais**: `frontend/src/design-system/tokens.json`, `frontend/src/design-system/tokens.css`, `frontend/scripts/generate-css-tokens.mjs`, `frontend/src/index.css`, `frontend/src/features/dashboard/HomePage.css`, `frontend/src/features/personal/PersonalPage.css`.
- **Notas**: O `index.css` deixou de ser a origem de valores e passou a funcionar como camada de compatibilidade para variáveis legadas (`--color-*`, `--space-*`, etc.) ainda usadas por CSS e por estilos inline em componentes TSX.

## Onde o Desenvolvimento Parou

- **Em progresso**: Conexão completa do Dashboard com dados reais do backend (remover mock data restantes) e evolução da `PersonalPage` com dados e interações reais.
- **Próximos passos**:
  1. Conectar `HomePage` (Dashboard) ao endpoint `GET /dashboard`.
  2. Implementar modal/página de "Nova Despesa" integrada ao Design System.
  3. Migrar telas de Autenticação para os novos componentes UI.
  4. Adicionar relatórios detalhados e gráficos.
- **Pendências**:
  - Responsividade (layout focado em Desktop no momento).
  - Edição/Exclusão de grupos e transações na IU.
  - Testes e2e automatizados.

## Endpoints / APIs (Estado Atual)

- **Implementados**: 
  - `POST /auth/register`, `/login`, `/forgot-password`, `/reset-password`.
  - `POST/GET /transactions`.
  - `POST/GET /couple`, `/groups`, `/groups/:id/balance`.
  - `GET /dashboard` (Real).
- **A implementar**: Filtros avançados, exportação de CSV/PDF.

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
```

## Convenções e Padrões

- **Padrão de Agente**: Research -> Strategy -> Execution (Research antes de agir).
- **Interface**: "Editorial Finance" (Plus Jakarta Sans para display, Inter para body).
- **Código**: TypeScript obrigatório; CSS focado em tokens e utilitários modernos (Flex/Grid).
- **Design Tokens**: `frontend/src/design-system/tokens.json` é a fonte única de verdade; `frontend/src/design-system/tokens.css` é artefato gerado.
- **Compatibilidade CSS**: Variáveis legadas em `frontend/src/index.css` devem apenas referenciar tokens gerados, nunca duplicar valores brutos manualmente.
