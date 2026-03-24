# Estado do Projeto – Centro Financeiro Social

> Última atualização: 2026-03-24
> Branch: feature/cursor

## Visão Geral

O projeto é uma aplicação de gerenciamento financeiro com foco em despesas pessoais, de casal e de grupo. A arquitetura é um monorepo com um backend em NestJS (Prisma/PostgreSQL) e um frontend em React (Vite/TypeScript/TanStack Query). O objetivo atual é concluir o MVP definido no PRD.

## Features Implementadas

### Fundação e Autenticação (Épico 1)

- **O que foi feito**: Setup inicial do monorepo, backend NestJS com Prisma, frontend React com Vite. Sistema de autenticação funcional com JWT, bcrypt e persistência de sessão.
- **Arquivos principais**:
  - `backend/src/auth/`: Lógica de autenticação (login, registro, JWT strategy).
  - `backend/src/users/`: Gerenciamento de usuários.
  - `frontend/src/features/auth/`: Telas de Login e Registro.
  - `frontend/src/services/api.ts`: Wrapper para chamadas fetch com tratamento de tokens.
- **Observações**: O backend usa PostgreSQL via Prisma. O frontend usa TanStack Query para gerenciamento de estado assíncrono.

### Transações Pessoais (Épico 2)

- **O que foi feito**: Modelo de dados, endpoints API e interface para criar e listar transações pessoais com categorias.
- **Arquivos principais**:
  - `backend/prisma/schema.prisma`: Modelo Transaction + enum Category, migration aplicada.
  - `backend/src/transactions/`: Módulo completo (controller, service, DTOs) com JWT guard.
  - `frontend/src/features/transactions/`: TransactionForm e TransactionList components.
  - `frontend/src/features/dashboard/HomePage.tsx`: Dashboard layout com sidebar + main content.
  - `frontend/src/types/transaction.ts`: Tipos e enum Category compartilhados.
- **Funcionalidades**:
  - `POST /transactions`: Criar transação (nome, valor, categoria, data).
  - `GET /transactions`: Listar transações do usuário ordenadas por data (mais recente primeiro).
  - 9 categorias: Food, Transport, Housing, Entertainment, Health, Shopping, Education, Utilities, Other.
  - Formulário com validação (React Hook Form + Zod).
  - Lista em tabela com formatação de valores e datas.
- **Observações**: Todas as transações são vinculadas ao usuário autenticado (user-scoped). Não há compartilhamento (couple/group) ainda.

## Onde o Desenvolvimento Parou

- **Em progresso**: Épico 2 (Transações) **concluído**. Próximo: Épico 3 (Relacionamentos de Casal) ou Épico 4 (Grupos).
- **Próximos passos**:
  1. Implementar modelo `Relationship` para casais (convite, aceite, vinculação).
  2. Adicionar lógica de split de despesas entre casal.
  3. Implementar modelo `Group` para despesas em grupo.
  4. Adicionar cálculos de saldos e relatórios básicos.
- **Pendências**:
  - Modelos de dados para relacionamentos de casal e grupos.
  - Endpoints de convites, aceites e gerenciamento de membros.
  - Lógica de divisão de despesas (split rules).
  - Dashboard com resumo financeiro e relatórios.

## Endpoints / APIs (Estado Atual)

- **Implementados**:
  - `POST /auth/register`: Cadastro de novo usuário.
  - `POST /auth/login`: Login e recebimento de JWT.
  - `GET /auth/me`: Perfil do usuário logado.
  - `POST /transactions`: Criar transação (requer JWT).
  - `GET /transactions`: Listar transações do usuário (requer JWT).
- **Não implementados**:
  - Endpoints de `relationships` (casal) e `groups`.
  - Endpoints de split de despesas e cálculos de saldo.

## Estrutura de Arquivos Relevantes

```text
/
├── backend/
│   ├── src/
│   │   ├── auth/              # JWT, Bcrypt, Login/Register
│   │   ├── users/             # User Service/Module
│   │   ├── transactions/      # Transaction domain (Epic 2)
│   │   │   ├── transactions.controller.ts
│   │   │   ├── transactions.service.ts
│   │   │   └── dto/
│   │   └── prisma/            # Prisma Service
│   └── prisma/
│       ├── schema.prisma      # Definição do banco (User, Transaction, Category)
│       └── migrations/        # Migration Epic 2 aplicada
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/          # LoginPage, RegisterPage
│   │   │   ├── dashboard/     # HomePage com dashboard layout
│   │   │   └── transactions/  # TransactionForm, TransactionList
│   │   ├── services/          # apiFetch
│   │   └── types/             # transaction.ts (Category enum, interfaces)
│   └── index.css              # Dashboard styles
└── docs/                      # PRD e Backlog Técnico
```

## Comandos Úteis

```bash
# Backend
cd backend && npm run start:dev

# Frontend
cd frontend && npm run dev

# Banco de dados (Prisma)
cd backend && npx prisma studio
cd backend && npx prisma migrate dev
```

## Convenções e Padrões

- **Backend**: NestJS seguindo padrão de módulos/services/controllers. Uso de DTOs para validação. Prisma 7 com driver adapter `@prisma/adapter-pg`.
- **Frontend**: Componentes funcionais React com TypeScript. Styled via Vanilla CSS (index.css). TanStack Query para data fetching. React Hook Form + Zod para formulários.
- **Commits**: Seguir o estilo já presente no histórico do git (geralmente mensagens diretas em inglês ou português conforme o contexto).
