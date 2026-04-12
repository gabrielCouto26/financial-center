# Estado do Projeto – Centro Financeiro Social

> Última atualização: 2026-04-11
> Branch: master

## Visão Geral

O projeto é uma aplicação de gerenciamento financeiro monorepo com backend em NestJS (Prisma/PostgreSQL) e frontend em React (Vite/TypeScript). O foco é o controle de despesas pessoais, de casal e em grupo, com um design "Editorial Finance" de alta fidelidade ao Figma.

Atualmente, o projeto concluiu a fundação de infraestrutura, autenticação e o roteamento da funcionalidade de "Nova Despesa", integrando o formulário de transações ao layout padrão da aplicação.

## Features Implementadas

### Fundação, Autenticação e Infraestrutura
- **O que foi feito**: Setup do monorepo, backend NestJS, frontend React. Autenticação JWT completa. Corrigido loop de redirecionamento no `/login` ao validar a sessão. `apiFetch` limpa o token em caso de `401`.
- **Arquivos principais**: `backend/src/auth/`, `frontend/src/features/auth/`, `frontend/src/App.tsx`, `frontend/src/services/api.ts`.

### Transações Multi-Contexto (Épico 2, 3 e 4)
- **O que foi feito**: Modelagem e implementação de transações Pessoais, de Casal e de Grupo. Endpoints de balanço e resumo agregados.
- **Arquivos principais**: `backend/src/transactions/`, `backend/src/couple/`, `backend/src/groups/`.
- **Atualização recente**: `/transactions` exige `direction` (INCOME/EXPENSE), oferece pesquisa e filtros. Dashboard consome dados reais.

### Layout e Roteamento "Nova Despesa" (Épico 5 - Refinado)
- **O que foi feito**: Unificação do `TransactionForm` com o layout padrão. Refatoração completa da UI para fidelidade "pixel-perfect" com o Stitch (`nova_despesa.html`). Implementados cálculos dinâmicos de split em moeda local, grid responsivo para valor/data, prefixo de moeda estilizado e toggle de tipo "Pill/Tab".
- **Arquivos principais**: `frontend/src/features/transactions/TransactionForm.tsx`, `frontend/src/features/transactions/TransactionForm.css`.
- **Notas**: O formulário agora redireciona de volta após o sucesso e suporta cancelamento via navegação com feedback visual premium nos botões.

### Design System e Redesign de Páginas (Épico 5)
- **O que foi feito**: Implementação de tokens de design, componentes atômicos e biblioteca de ícones. Redesign total da `HomePage` e `PersonalPage`.
- **Arquivos principais**: `frontend/src/design-system/`, `frontend/src/features/dashboard/HomePage.tsx`, `frontend/src/features/personal/PersonalPage.tsx`.

## Onde o Desenvolvimento Parou

- **Concluído**: 
  - Refatoração visual da "Nova Despesa" para alta fidelidade.
  - Atualização da seção de Grupos no Dashboard para o estado "Em breve" (Coming Soon), ocultando dados parciais.
- **Próximos passos**:
  1. Validar o fluxo completo de criação de transação com dados reais no frontend (testar submissão).
  2. Implementar feedback visual (Toasts) após a criação de transação.
  3. Expandir filtros e paginação na IU para listas de transações.
  4. Ativar testes end-to-end para o fluxo de nova despesa.

## Endpoints / APIs (Estado Atual)

- **Implementados**: 
  - `POST /auth/register`, `/login`, `/forgot-password`, `/reset-password`.
  - `POST/GET /transactions`.
  - `POST/GET /couple`, `/groups`, `/groups/:id/balance`.
  - `GET /dashboard` (Real).

## Estrutura de Arquivos Relevantes

```text
/
├── backend/src/       # NestJS Modules
├── frontend/src/
│   ├── design-system/ # Atomic Components, tokens
│   ├── features/      # Business features (dashboard, personal, transactions)
│   ├── App.tsx        # Routing & Layout
│   └── index.css      # Style Resets
└── docs/              # PRD, Guidelines
```

## Useful Commands

```bash
# Iniciar ambiente de desenvolvimento
cd backend && npm run start:dev
cd frontend && npm run dev

# Verificações
npm run lint:frontend
npm run typecheck:frontend
```

## Convenções e Padrões

- **Padrão de Agente**: Research -> Strategy -> Execution.
- **Interface**: "Editorial Finance" (Plus Jakarta Sans, Inter).
- **Código**: TypeScript; CSS focado em tokens.
- **Roteamento**: Uso de `react-router-dom` com layout persistente em cada feature.
