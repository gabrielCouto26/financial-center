# Estado do Projeto – Centro Financeiro Social

> Última atualização: 2026-03-26
> Branch: feature/couple

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

### Relacionamentos de Casal (Épico 3)

- **O que foi feito**: Implementação do modelo `Relationship` para vincular dois usuários como casal, com suporte a transações compartilhadas e split de despesas.
- **Arquivos principais**:
  - `backend/prisma/schema.prisma`: Modelo Relationship, CoupleTransaction e enum TransactionType.
  - `backend/prisma/migrations/20260326090000_add_couple_transactions/`: Migration criada.
  - `backend/src/couple/`: Novo módulo com CoupleService, CoupleController e DTO.
  - `backend/src/couple/dto/link-couple.dto.ts`: DTO com email validation para linking de casais.
  - `backend/src/transactions/`: TransactionsService e Controller atualizados para suportar couple transactions.
  - `frontend/src/features/couple/CouplePanel.tsx`: Novo componente para gerenciar linking de casal e exibir saldo.
  - `frontend/src/types/couple.ts`: Tipos para relacionamentos de casal.
  - `frontend/src/features/transactions/`: TransactionForm e TransactionList atualizados.
- **Funcionalidades**:
  - Linking de usuários via email (criação de convite/relacionamento).
  - Transações pessoais e transações de casal com split de despesas (percentual configurável).
  - Listagem de transações com detalhes do casal e percentuais de split.
  - CouplePanel exibindo status do casal e saldo compartilhado.
- **Observações**: O sistema agora diferencia transações pessoais de transações de casal, com suporte a múltiplas formas de split.

## Onde o Desenvolvimento Parou

- **Em progresso**: Épico 3 (Relacionamentos de Casal) **implementado**. Próximo: Épico 4 (Grupos) ou refinamentos de UX/validações.
- **Próximos passos**:
  1. Implementar modelo `Group` para despesas em grupo (com múltiplos membros).
  2. Adicionar endpoints de convites e aceites (se ainda não houver fluxo completo).
  3. Implementar lógica de dividir despesas entre N pessoas no grupo.
  4. Adicionar cálculos avançados de saldos e relatórios financeiros.
  5. Melhorar validações e tratamento de erros na API.
- **Pendências**:
  - Modelo completo de `Group` e endpoints associados.
  - Lógica de convites e aceites para grupos.
  - Cálculos de saldo consolidados (pessoal + casal + grupos).
  - Dashboard com resumo financeiro e relatórios detalhados.
  - Testes end-to-end para fluxos de casal.

## Endpoints / APIs (Estado Atual)

- **Implementados**:
  - `POST /auth/register`: Cadastro de novo usuário.
  - `POST /auth/login`: Login e recebimento de JWT.
  - `GET /auth/me`: Perfil do usuário logado.
  - `POST /transactions`: Criar transação (pessoal ou de casal, requer JWT).
  - `GET /transactions`: Listar transações do usuário com detalhes de casal (requer JWT).
  - `POST /couple/link`: Vincular usuário a um casal via email.
  - `GET /couple`: Obter informações do casal do usuário logado.
- **Não implementados**:
  - Endpoints de `groups` (despesas em grupo).
  - Endpoints de convites e aceites formalizados.
  - Endpoints de split de despesas e cálculos de saldo consolidados.

## Estrutura de Arquivos Relevantes

```text
/
├── backend/
│   ├── src/
│   │   ├── auth/              # JWT, Bcrypt, Login/Register
│   │   ├── users/             # User Service/Module
│   │   ├── couple/            # Couple Service/Module (Épico 3)
│   │   │   ├── couple.controller.ts
│   │   │   ├── couple.service.ts
│   │   │   └── dto/
│   │   │       └── link-couple.dto.ts
│   │   ├── transactions/      # Transaction domain (Epic 2 + 3)
│   │   │   ├── transactions.controller.ts
│   │   │   ├── transactions.service.ts
│   │   │   └── dto/
│   │   │       └── create-transaction.dto.ts
│   │   └── prisma/            # Prisma Service
│   └── prisma/
│       ├── schema.prisma      # User, Transaction, Relationship, CoupleTransaction
│       └── migrations/        # Migrations (Epic 2 + Epic 3)
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/          # LoginPage, RegisterPage
│   │   │   ├── couple/        # CouplePanel (Épico 3)
│   │   │   ├── dashboard/     # HomePage com dashboard layout
│   │   │   └── transactions/  # TransactionForm, TransactionList
│   │   ├── services/          # apiFetch
│   │   └── types/             # transaction.ts, couple.ts (Épico 3)
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
