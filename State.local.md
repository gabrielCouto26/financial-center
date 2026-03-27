# Estado do Projeto – Centro Financeiro Social

> Última atualização: 2026-03-27 (Design System Inicial)
> Branch: feature/dashboard

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

### Grupos e Despesas em Grupo (Épico 4)

- **O que foi feito**: Implementação do módulo `Group` para despesas compartilhadas entre múltiplos usuários, com suporte a split igualitário ou porcentual, e cálculo de saldos e acertos.
- **Arquivos principais**:
  - `backend/prisma/schema.prisma`: Modelos `Group`, `GroupMember` e atualização de `TransactionType` com `GROUP`.
  - `backend/prisma/migrations/`: Migration para as tabelas de grupos.
  - `backend/src/groups/`: Novo módulo completo com GroupsController, GroupsService e DTOs.
  - `backend/src/transactions/`: Atualizado para suportar transações do tipo `GROUP` com validações específicas.
  - `frontend/src/features/groups/`: Novos componentes para criação, listagem e gerenciamento de grupos.
  - `frontend/src/features/transactions/`: TransactionForm e TransactionList refatorados para suportar os 3 modos (PERSONAL, COUPLE, GROUP).
  - `frontend/src/types/group.ts`: Tipos para grupos.
- **Funcionalidades**:
  - Criação de grupos com nome definido pelo usuário.
  - Adição de membros a grupos (usuários devem estar registrados).
  - Transações de grupo com split igualitário (todos membros ou subconjunto) ou porcentual customizado.
  - Endpoint `GET /groups/:groupId/balance` retornando saldos por membro (`paid`, `share`, `net`) e lista de acertos (`settlements`).
  - Autorização: apenas membros do grupo podem ver dados e criar transações.
- **Endpoints de Grupo**:
  - `POST /groups`: Criar grupo (criador é auto-adicionado como membro).
  - `GET /groups`: Listar grupos do usuário logado.
  - `GET /groups/:groupId`: Obter detalhes de um grupo específico.
  - `POST /groups/:groupId/members`: Adicionar membro ao grupo via email.
  - `GET /groups/:groupId/balance`: Obter saldo e acertos do grupo.
- **Observações**: O contrato de transações foi generalizado para suportar 3 modos. Validações específicas por tipo garantem integridade dos dados.

### Dashboard Consolidado (Resumo Global)

- **O que foi feito**: Backend ganhou módulo `Dashboard` para agregar métricas mensais e saldo líquido combinando contextos pessoal, casal e grupos. Frontend recebeu uma HomePage reestruturada com cards de resumo, visões rápidas de casal/grupos, tabela de transações recentes e acesso direto aos painéis de gestão.
- **Arquivos principais**:
  - `backend/src/dashboard/`: Controller, service e módulo importado em `app.module.ts`.
  - `frontend/src/features/dashboard/`: HomePage, SummaryCards, CoupleOverviewCard, GroupsOverviewCard, RecentTransactionsCard.
  - `frontend/src/types/dashboard.ts`: Tipagem da resposta de `/dashboard`.
  - `frontend/src/index.css`: Estilos do layout (hero cards, grids, sidebar + main content).
- **Funcionalidades**:
  - Endpoint `GET /dashboard` (JWT) retorna período corrente (YYYY-MM), gasto do mês, saldo líquido agregado, resumo do casal (youOwe/owedToYou/net), resumo de grupos (groupCount/totalNet) e últimas 10 transações acessíveis.
  - Cálculo de gasto do mês considera splits de casal/grupo; saldo líquido soma pessoal + net do casal + net dos grupos.
  - HomePage exibe formulário de transação na sidebar, cards de métricas, visões rápidas e tabela de recentes; mantém CouplePanel e GroupPanel no grid de gestão.
- **Observações**: Métricas arredondadas para 2 casas; transações recentes ordenadas por data/createdAt; logout limpa caches de queries (me, couple, groups, dashboard, transactions) para evitar dados stale.

### Design System & UI Components (Épico 5 - Inicial)

- **O que foi feito**: Implementação da base do Design System ("Editorial Finance") com tokens sincronizados do Figma, fontes customizadas, e componentes UI atômicos reutilizáveis.
- **Arquivos principais**:
  - `frontend/src/design-system/tokens.json`: Definição de cores, tipografia, espaçamento e raios.
  - `frontend/src/design-system/Button/`: Componente Button com variantes (primary, secondary, text).
  - `frontend/src/design-system/Input/`: Componente Input com estilo "underlined".
  - `frontend/src/design-system/Card/`: Componente Card com variantes (primary, insight).
  - `frontend/src/design-system/Badge/`: Componente Badge para status e tendências.
  - `frontend/src/design-system/Icons/`: Biblioteca de ícones internos (SVG).
  - `frontend/src/features/dev/ComponentLab.tsx`: Página de laboratório para visualização e teste dos componentes.
- **Funcionalidades**:
  - Uso de CSS Variables injetadas no `:root` a partir dos tokens.
  - Suporte a temas e consistência visual rigorosa com o Figma.
  - Implementação de variantes visuais complexas (ex: Insight Card com gradientes).
- **Observações**: O `index.css` foi refatorado para usar as novas variáveis mantendo retrocompatibilidade com o layout legado.

## Onde o Desenvolvimento Parou

- **Status**: Design System base implementado e validado. Dashboard consolidado operacional.
- **Próximos passos**:
  1. Migrar os componentes das páginas existentes (`HomePage`, `LoginPage`, `RegisterPage`) para os novos componentes do Design System.
  2. Implementar despesas recorrentes e agendadas.
  3. Refinar UX do dashboard (filtros de período, drill-down por contexto).
  4. Implementar edição e exclusão de grupos/membros.
- **Pendências**:
  - Migração de telas legadas para o novo Design System.
  - Edição e exclusão de grupos.
  - Relatórios detalhados.


## Endpoints / APIs (Estado Atual)

- **Autenticação**:
  - `POST /auth/register`: Cadastro de novo usuário.
  - `POST /auth/login`: Login e recebimento de JWT.
  - `GET /auth/me`: Perfil do usuário logado.

- **Transações** (unificadas para 3 modos):
  - `POST /transactions`: Criar transação (pessoal, casal ou grupo, requer JWT).
    - `PERSONAL`: transação individual.
    - `COUPLE`: transação de casal com `paidByUserId` e `splits`.
    - `GROUP`: transação de grupo com `groupId`, `paidByUserId`, e split igualitário ou porcentual.
  - `GET /transactions`: Listar transações acessíveis ao usuário (próprias + casal + grupos que participa).

- **Casal**:
  - `POST /couple/link`: Vincular usuário a um casal via email.
  - `GET /couple`: Obter informações do casal do usuário logado.

- **Grupos**:
  - `POST /groups`: Criar novo grupo (criador vira membro automaticamente).
  - `GET /groups`: Listar grupos do usuário logado.
  - `GET /groups/:groupId`: Obter detalhes de um grupo específico.
  - `POST /groups/:groupId/members`: Adicionar membro ao grupo via email.
  - `GET /groups/:groupId/balance`: Obter saldo do grupo com `paid`, `share`, `net` por membro e lista de acertos (`settlements`).

- **Dashboard**:
  - `GET /dashboard`: Retorna mês corrente, gasto do mês, saldo líquido agregado, resumo de casal (youOwe/owedToYou/net), resumo de grupos (count/net) e últimas 10 transações acessíveis.

- **Contratos de Resposta**:
  - Transações retornam metadados expandidos: `couple`, `group`, e `splits`.
  - Grupos retornam apenas para membros autorizados.

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
│   │   ├── groups/            # Groups Service/Module (Épico 4 - NOVO)
│   │   │   ├── groups.controller.ts
│   │   │   ├── groups.service.ts
│   │   │   └── dto/
│   │   │       ├── create-group.dto.ts
│   │   │       └── add-member.dto.ts
│   │   ├── dashboard/         # Dashboard Service/Module (overview consolidado)
│   │   ├── transactions/      # Transaction domain (Epic 2, 3, 4)
│   │   │   ├── transactions.controller.ts
│   │   │   ├── transactions.service.ts
│   │   │   └── dto/
│   │   │       └── create-transaction.dto.ts
│   │   └── prisma/            # Prisma Service
│   └── prisma/
│       ├── schema.prisma      # User, Transaction, Relationship, CoupleTransaction, Group, GroupMember
│       └── migrations/        # Migrations (Epic 2, 3, 4)
├── frontend/
│   ├── src/
│   │   ├── design-system/     # Design Tokens e Componentes Atômicos (NOVO)
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   └── Icons/
│   │   ├── features/
│   │   │   ├── auth/          # LoginPage, RegisterPage
│   │   │   ├── dev/           # ComponentLab (NOVO)
│   │   │   ├── couple/        # CouplePanel (Épico 3)
│   │   │   ├── groups/        # GroupList, GroupDetail, GroupForm
│   │   │   ├── dashboard/     # HomePage reestruturada + cards de overview
│   │   │   └── transactions/  # TransactionForm, TransactionList
│   │   ├── services/          # apiFetch
│   │   └── types/             # Tipagens globais
│   └── index.css              # Global styles & CSS Variables (Refatorado)
├── docs/                      # PRD e Backlog Técnico
└── epic-4.md                  # Plano de implementação do Épico 4
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
