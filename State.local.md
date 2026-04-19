# Project State – Financial Center

> Última atualização: 2026-04-19
> Branch: feature/couple-ui

## Overview

Financial Center is a multi-context financial management application built as a **pnpm monorepo** (migrated from npm) with a NestJS backend (Prisma/PostgreSQL) under `apps/backend/` and a Vite + React frontend (TypeScript) under `apps/frontend/`. The application covers personal, couple, and group expense tracking, with a premium "Financial Center" design language (Plus Jakarta Sans for headings, Inter for body, sleek dark-mode cards, and glassmorphism interactions).

As of this session, the project has a fully functional CI/CD pipeline (GitHub Actions), completed auth flows, New Expense workflow, Dashboard, Personal page, and a new high-fidelity `CouplePage` implemented on branch `feature/couple-ui` — staged and awaiting PR.

## Implemented Features

### Foundation & Infrastructure
- **What was done**: Migrated from npm to **pnpm workspace** (`pnpm-workspace.yaml`). Apps moved to `apps/backend/` and `apps/frontend/`. `lint-staged` hooks updated to new paths. Root-level `package.json` scripts use `pnpm --filter <workspace>` pattern.
- **Main files**: `pnpm-workspace.yaml`, `package.json` (root), `.npmrc`, `.husky/`.
- **Note**: `pnpm install --frozen-lockfile` is enforced in CI.

### CI/CD Pipeline
- **What was done**: GitHub Actions workflow (`.github/workflows/ci.yml`) that runs on push to `master` and on any PR. Steps: checkout → Node 20 → pnpm 9 → cache → install → `prisma:generate` → lint → test+typecheck → build.
- **Main files**: `.github/workflows/ci.yml`.
- **Note**: `pull_request.branches` is intentionally empty (`[]`) so the pipeline fires for PRs targeting **any** branch.

### Auth & Session Management
- **What was done**: JWT authentication with password reset/forgot flows. `apiFetch` wrapper handles token refresh and session validation to prevent redirect loops.
- **Main files**: `apps/backend/src/auth/`, `apps/frontend/src/features/auth/`, `apps/frontend/src/services/api.ts`, `apps/frontend/src/App.tsx`.

### Multi-Context Transactions (Personal / Couple / Groups)
- **What was done**: Prisma models and NestJS modules for Personal, Couple, and Group transactions. Real-time balance calculations and summary endpoints.
- **Main files**: `apps/backend/src/transactions/`, `apps/backend/src/couple/`, `apps/backend/src/groups/`.
- **Note**: Transactions support searchable queries and filters (direction, category). Dashboard aggregates all contexts.

### "New Expense" Workflow
- **What was done**: Pixel-perfect `TransactionForm` integrated into the global Sidebar/Header layout. Features dynamic split calculations (BRL), responsive grid for amount/date, and a premium Pill/Tab toggle for transaction types.
- **Main files**: `apps/frontend/src/features/transactions/TransactionForm.tsx`, `apps/frontend/src/features/transactions/TransactionForm.css`.

### Design System & Global Layout
- **What was done**: Atomic components (Button, Card, Input) and design tokens (colors, typography) in a shared design-system folder. High-fidelity redesign of `HomePage` and `PersonalPage` with Vanilla CSS.
- **Main files**: `apps/frontend/src/design-system/`, `apps/frontend/src/features/dashboard/HomePage.tsx`, `apps/frontend/src/features/personal/PersonalPage.tsx`.
### Dependency Remediation & Vulnerability Fixes (Stages 1-4)
- **What was done**: Resolved all advisory-backed findings (`hono`, `@hono/node-server`) via `pnpm.overrides`. Performed non-breaking patch and minor upgrades across root, backend, and frontend. Aligned `@types/node` versions between workspaces.
- **Main files**: `package.json` (root), `apps/backend/package.json`, `apps/frontend/package.json`, `pnpm-lock.yaml`.
- **Note**: `pnpm audit` now reports zero vulnerabilities. Major breaking upgrades (ESLint 10, TypeScript 6, Vite 8, Zod 4) are scheduled as isolated future tasks.

### Couple Finance Page (feature/couple-ui — staged, not merged)
- **What was done**: Full replacement of the legacy `CouplePanel.tsx` with a bento-grid `CouplePage`. Integrates `/couple` and `/couple/balance` API endpoints via React Query. Granular sub-components created:
  - `CoupleBalanceHero` — hero card with total shared balance and partner summary.
  - `CategorySplitCard` — breakdown of spending by category with progress bars.
  - `SharedExpensesList` — paginated list of shared transactions with current-user highlighting.
  - `SettlementCard` — who owes whom and settlement CTA.
  - `CoupleProfileCard` — partner avatars, names, and balance split.
  - `CoupleGoalCard` — shared financial goal tracker (UI placeholder).
- **Main files**: `apps/frontend/src/features/couple/CouplePage.tsx`, `apps/frontend/src/features/couple/CouplePage.css`, `apps/frontend/src/features/couple/components/`.
- **Note**: `App.tsx` updated to route `/couple` → `<CouplePage>`. The old `CouplePanel.tsx` is still present but superseded.

### Expense Edition Feature
- **What was done**: Implemented fullstack capability to edit existing transactions. Added `GET /transactions/:id` and `PUT /transactions/:id` endpoints in the backend and a new `EditTransactionForm` screen in the frontend. Reused existing design tokens and `TransactionForm` structure.
- **Main files**: `apps/backend/src/transactions/`, `apps/frontend/src/features/transactions/EditTransactionForm.tsx`, `apps/frontend/src/App.tsx`.
- **Note**: The edit screen is accessible via `/edit-expense/:id` and mimics the "New Expense" UI.

## Where Development Stopped

- **In Progress**:
  - **CouplePage PR**: All changes are staged on `feature/couple-ui`. Next step is opening a PR to `master` (CI will run automatically).
  - **Groups**: Backend models and basic endpoints exist; UI is locked to a "Coming Soon" (Em breve) state in the Dashboard.
- **Next Steps**:
  1. Open PR from `feature/couple-ui` → `master` and pass CI checks.
  2. Validate `CouplePage` rendering with real API data (real partner link required).
  3. Implement global Toast notifications for transaction success/error feedback.
  4. Activate Group management UI (create group, add members, view balance).
  5. Expand filtering and pagination for long transaction lists in all contexts.
- **Pending**:
  - Advanced data visualizations (category/trend charts).
  - Multi-user real-time updates (WebSockets or long-polling).
  - Batch transaction exports (CSV/PDF).

## Endpoints / APIs (Current State)

- **Implemented**:
  - Auth: `POST /auth/register`, `/auth/login`, `/auth/forgot-password`, `/auth/reset-password`, `GET /auth/me`.
  - Transactions: `POST /transactions`, `GET /transactions`, `GET /transactions/:id`, `PUT /transactions/:id`.
  - Couple: `POST /couple/link`, `GET /couple`, `GET /couple/balance`.
  - Groups: `POST /groups`, `GET /groups`, `GET /groups/:id/balance`.
  - Dashboard: `GET /dashboard`.
- **Not implemented**:
  - Detailed Group analytics.
  - Batch transaction exports (CSV/PDF).
  - WebSocket real-time updates.

## Relevant File Structure

```text
/
├── .github/workflows/ci.yml   # GitHub Actions CI pipeline
├── apps/
│   ├── backend/src/           # NestJS modules (auth, transactions, couple, groups)
│   └── frontend/src/
│       ├── design-system/     # Reusable UI components & design tokens
│       ├── features/
│       │   ├── auth/          # Login, Register, ForgotPassword, ResetPassword
│       │   ├── dashboard/     # HomePage.tsx
│       │   ├── personal/      # PersonalPage.tsx
│       │   ├── couple/        # CouplePage.tsx + components/ (new bento-grid UI)
│       │   └── transactions/  # TransactionForm.tsx (New Expense)
│       ├── types/             # Shared TS types (user, couple, etc.)
│       └── App.tsx            # Main Router & global layout logic
├── docs/                      # PRDs, Technical Backlog & Stitch Assets
├── pnpm-workspace.yaml        # pnpm monorepo config
└── package.json               # Root scripts using pnpm --filter
```

## Useful Commands

```bash
# Start backend (development)
pnpm --filter backend start:dev

# Start frontend (development)
pnpm --filter frontend dev

# Lint all workspaces
pnpm lint:all

# Typecheck + backend tests
pnpm test:all

# Build all workspaces
pnpm build

# Generate Prisma client
pnpm --filter backend prisma:generate
```

## Conventions and Patterns

- **Package Manager**: pnpm workspaces — always use `pnpm --filter <app>` for workspace-specific commands.
- **UI Strategy**: Pixel-perfect fidelity to Stitch/Figma references. **No Tailwind** — Vanilla CSS with design tokens only.
- **Typography**: Plus Jakarta Sans for headings, Inter for body text.
- **State Management**: React Query for server state; local `useState`/`useReducer` for UI-only state.
- **Component Design**: Atomic design pattern. Each feature folder owns its CSS file.
- **API Calls**: Always use the `apiFetch` wrapper from `services/api.ts` (handles auth headers and 401 redirects).
- **CI Gate**: PRs must pass lint → typecheck → build before merging to `master`.
