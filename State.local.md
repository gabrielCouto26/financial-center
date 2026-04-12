# Estado do Projeto – Financial Center

> Última atualização: 2026-04-12
> Branch: master

## Visão Geral

O projeto é uma aplicação de gerenciamento financeiro monorepo estruturada com **pnpm workspaces**. Consiste em um backend NestJS (Prisma/PostgreSQL) e um frontend React (Vite/TypeScript), ambos localizados dentro do diretório `apps/`. O objetivo é o controle de despesas pessoais, de casal e em grupo, com um design premium e alta fidelidade.

Recentemente, o projeto foi migrado para **pnpm**, consolidando a estrutura de monorepo e incluindo automação de CI/CD via GitHub Actions.

## Features Implementadas

### Infraestrutura e Monorepo (pnpm)
- **O que foi feito**: Migração completa para `pnpm workspaces`. Reorganização dos módulos para `apps/backend` e `apps/frontend`. Configuração de scripts globais no root para linting, testes e build.
- **Arquivos principais**: `pnpm-workspace.yaml`, `package.json` (root), `apps/`.

### CI/CD e Qualidade
- **O que foi feito**: Implementação de workflow de CI no GitHub Actions (`.github/workflows/ci.yml`) que executa lint, typecheck, testes de backend e build em cada PR ou Push para a branch `master`.
- **Arquivos principais**: `.github/workflows/ci.yml`, `.gitignore` (ajustado para permitir `pnpm-lock.yaml`).

### Transações e Layout "Nova Despesa"
- **O que foi feito**: Implementação de transações nos contextos Pessoal, Casal e Grupo. UI de "Nova Despesa" com fidelidade pixel-perfect ao Stitch, incluindo cálculos dinâmicos de split e layout responsivo.
- **Arquivos principais**: `apps/frontend/src/features/transactions/`, `apps/backend/src/transactions/`.

### Design System e Redesign
- **O que foi feito**: Implementação de tokens de design e componentes atômicos. Redesign total da `HomePage` e `PersonalPage`.
- **Arquivos principais**: `apps/frontend/src/design-system/`, `apps/frontend/src/features/dashboard/`.

## Onde o Desenvolvimento Parou

- **Concluído**: 
  - Migração para pnpm e configuração de workspace.
  - Setup do Workflow de CI (Build, Lint, Test).
  - Ajuste de permissões de arquivo no Git (`pnpm-lock.yaml`).
- **In progress**:
  - Implementação da página de Finanças em Conjunto ("Couple").
- **Próximos passos**:
  1. Validar a execução da pipeline de CI no GitHub com os commits mais recentes.
  2. Implementar a lógica de integração dos endpoints `/couple` e `/couple/balance` na nova UI de casal.
  3. Adicionar feedback visual (Toasts) após ações de sucesso no formulário.
  4. Finalizar a implementação da página de Grupos.

## Endpoints / APIs (Estado Atual)

- **Implementados**: 
  - `POST /auth/register`, `/login`.
  - `POST/GET /transactions`.
  - `POST/GET /couple`, `/groups`.
  - `GET /dashboard` (Real).

## Estrutura de Arquivos Relevantes

```text
/
├── apps/
│   ├── backend/       # NestJS + Prisma
│   └── frontend/      # Vite + React
├── .github/workflows/ # GitHub Actions (CI)
├── pnpm-workspace.yaml
├── State.local.md     # Este arquivo
└── docs/              # Backlog e Guias
```

## Useful Commands

```bash
# Instalação (Monorepo)
pnpm install

# Verificações Globais
pnpm lint:all
pnpm test:all
pnpm build
```

## Convenções e Padrões

- **Padrão de Agente**: Research -> Strategy -> Execution.
- **Package Manager**: `pnpm` (essencial manter o `pnpm-lock.yaml` commitado).
- **CI/CD**: Toda alteração na `master` ou PR deve passar no workflow definido em `.github/workflows/ci.yml`.
- **Código**: TypeScript obrigatório; CSS focado em tokens do Design System.
