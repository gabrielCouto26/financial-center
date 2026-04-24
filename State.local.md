# Project State – Financial Center

> Última atualização: 2026-04-23
> Branch: feature/v0-frontend

## Overview

Financial Center is a multi-context financial management application built as a **pnpm monorepo** with a NestJS backend (Prisma/PostgreSQL) and a Vite + React frontend (TypeScript). The application covers personal, couple, and group expense tracking.

At this moment, the **backend is fully functional**, featuring authentication, transaction management across multiple contexts, and couple/group logic. However, the **frontend has been recently reset** on the current branch (`feature/v0-frontend`). Almost all UI components, layouts, and pages were removed to allow for a clean-slate reconstruction of the interface.

## Implemented Features

### Backend Infrastructure & Logic
- **Auth**: JWT-based authentication with registration, login, and password recovery.
- **Contexts**: Full support for Personal, Couple, and Group transactions in the database and API.
- **Prisma**: Migrations up to date, including User name fields and transaction directions.
- **Main files**: `apps/backend/src/`

### Frontend Foundation (Preserved)
- **API Service**: The `apiFetch` wrapper remains, handling authentication headers and session management.
- **Types**: All shared TypeScript types for Users, Transactions, Couples, and Groups are preserved.
- **Main files**: `apps/frontend/src/services/api.ts`, `apps/frontend/src/types/`

### CI/CD Pipeline
- **Status**: GitHub Actions workflow (`.github/workflows/ci.yml`) is active, running lint, typecheck, and build on PRs and pushes.
- **Note**: Current frontend state will likely fail build/typecheck due to missing entry points (`main.tsx`, `App.tsx`).

## Where Development Stopped

- **In Progress**: 
    - **Frontend Reconstruction**: The frontend is in a "Clean Slate" state. The previous layout (Sidebar, Header, DashboardLayout) and all feature pages were removed.
- **Next Steps**:
    1. Restore/Re-implement the frontend entry point (`main.tsx`) and root component (`App.tsx`).
    2. Re-implement the global layout and navigation.
    3. Re-build pages (Auth, Dashboard, Couple, Personal) using the new design iteration.
- **Pending**:
    - All frontend UI features that were previously implemented (New Expense, Couple Bento Grid, Edit Expense) need to be restored or re-developed.

## Endpoints / APIs (Current State)

- **Implemented (Backend)**:
    - Auth: `POST /auth/register`, `/auth/login`, `/auth/forgot-password`, `/auth/reset-password`, `GET /auth/me`.
    - Transactions: `POST /transactions`, `GET /transactions`, `GET /transactions/:id`, `PUT /transactions/:id`.
    - Couple: `POST /couple/link`, `GET /couple`, `GET /couple/balance`.
    - Groups: `POST /groups`, `GET /groups`, `GET /groups/:id/balance`.
    - Dashboard: `GET /dashboard`.

## Relevant File Structure

```text
/
├── apps/
│   ├── backend/src/           # Fully functional NestJS modules
│   └── frontend/
│       ├── src/
│       │   ├── services/      # apiFetch service
│       │   └── types/         # Shared TypeScript types
│       ├── package.json       # Reset to basic dependencies (React 19)
│       └── index.html         # Empty entry point
├── docs/                      # PRDs and technical documentation
├── pnpm-workspace.yaml        # Monorepo configuration
└── package.json               # Root scripts
```

## Useful Commands

```bash
# Start backend (development)
pnpm --filter backend start:dev

# Start frontend (development) - NOTE: currently missing entry point
pnpm --filter frontend dev

# Generate Prisma client
pnpm --filter backend prisma:generate

# Build all (Backend should pass, Frontend will fail)
pnpm build
```

## Conventions and Patterns

- **Monorepo**: pnpm workspaces.
- **UI Strategy**: Clean slate reconstruction. Previous strategy was Vanilla CSS with design tokens.
- **State Management**: React Query (server) + React Hooks (local).
- **API Calls**: Must use `apiFetch` from `services/api.ts`.
