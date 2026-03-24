# Estado do Projeto – Centro Financeiro Social

> Última atualização: 2026-03-23
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

## Onde o Desenvolvimento Parou

- **Em progresso**: Finalizada a autenticação básica; iniciando Épico 2 (Transações).
- **Próximos passos**:
  1. Definir o modelo `Transaction` no `schema.prisma`.
  2. Criar o módulo de `Transactions` no backend (CRUD básico).
  3. Implementar formulário de criação de despesa e lista na `HomePage` (dashboard) no frontend.
  4. Implementar modelos para `Relationship` (casal) e `Group`.
- **Pendências**:
  - Modelos de dados para despesas, grupos e relacionamentos.
  - Endpoints de transações, saldos e gerenciamento de grupos.
  - UI da dashboard (atualmente apenas um skeleton de boas-vindas).

## Endpoints / APIs (Estado Atual)

- **Implementados**:
  - `POST /auth/register`: Cadastro de novo usuário.
  - `POST /auth/login`: Login e recebimento de JWT.
- **Não implementados**:
  - `GET /transactions`: Listagem de transações.
  - `POST /transactions`: Criação de transação.
  - `GET /users/me`: Perfil do usuário logado (usado via payload do JWT por enquanto).
  - Endpoints de `groups` e `couple`.

## Estrutura de Arquivos Relevantes

```text
/
├── backend/
│   ├── src/
│   │   ├── auth/         # JWT, Bcrypt, Login/Register
│   │   ├── users/        # User Service/Module
│   │   └── prisma/       # Prisma Service
│   └── prisma/
│       └── schema.prisma # Definição do banco
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/     # LoginPage, RegisterPage
│   │   │   └── dashboard/# HomePage (Skeleton)
│   │   └── services/     # apiFetch
└── docs/                 # PRD e Backlog Técnico
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

- **Backend**: NestJS seguindo padrão de módulos/services/controllers. Uso de DTOs para validação.
- **Frontend**: Componentes funcionais React com TypeScript. Styled via Vanilla CSS (index.css). TanStack Query para data fetching.
- **Commits**: Seguir o estilo já presente no histórico do git (geralmente mensagens diretas em inglês ou português conforme o contexto).
