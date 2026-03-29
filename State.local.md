# Estado do Projeto – Centro Financeiro Social

> Última atualização: 2026-03-28
> Branch: feature/gemini-flash-3-preview

## Visão Geral

O projeto é uma aplicação de gerenciamento financeiro monorepo com backend em NestJS (Prisma/PostgreSQL) e frontend em React (Vite/TypeScript). O foco é o controle de despesas pessoais, de casal e em grupo, com um design "Editorial Finance" de alta fidelidade ao Figma.

Atualmente, o projeto concluiu a fundação de infraestrutura, autenticação, transações multi-contexto (pessoal/casal/grupo) e está em fase de implementação de um redesign completo baseado no Design System atômico.

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

## Onde o Desenvolvimento Parou

- **Em progresso**: Implementação da página de transações pessoais (`PersonalPage`) e conexão do Dashboard com dados reais do backend (remover mock data).
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
│   ├── design-system/ # Atomic Components & Tokens
│   ├── features/      # Business features (dashboard, personal, auth, groups)
│   ├── App.tsx        # Routing & Layout
│   └── index.css      # Custom vars & resets
└── docs/              # PRD, Guidelines, Prompts
```

## Useful Commands

```bash
# Iniciar ambiente de desenvolvimento
cd backend && npm run start:dev
cd frontend && npm run dev

# Sincronização de Banco de Dados
npx prisma migrate dev
npx prisma studio
```

## Convenções e Padrões

- **Padrão de Agente**: Research -> Strategy -> Execution (Research antes de agir).
- **Interface**: "Editorial Finance" (Plus Jakarta Sans para display, Inter para body).
- **Código**: TypeScript obrigatório; CSS focado em tokens e utilitários modernos (Flex/Grid).
