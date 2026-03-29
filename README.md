# Centro Financeiro Social

Monorepo layout: `backend/` (NestJS + Prisma + PostgreSQL), `frontend/` (Vite + React + TypeScript).

The frontend uses a token-driven design system. `frontend/src/design-system/tokens.json` is the source of truth, `frontend/scripts/generate-css-tokens.mjs` exports `frontend/src/design-system/tokens.css`, and `frontend/src/index.css` keeps legacy CSS variable aliases for compatibility.

## Prerequisites

- Node.js 20+ (recommended)
- Docker (for local PostgreSQL)

## 1. Database

From the repository root:

```bash
docker compose up -d
```

Default connection matches `backend/.env.example` (`app` / `app`, database `financial_center`, port `5432`).

## 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env if needed (DATABASE_URL, JWT_SECRET, FRONTEND_ORIGIN)

npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

- API base URL: `http://localhost:3000/api`
- Health: `GET http://localhost:3000/api/health`
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (Bearer JWT)
- Transactions: `POST /api/transactions` (create), `GET /api/transactions` (list) — requires Bearer JWT
- Transactions now accept `direction` (INCOME/EXPENSE) and support text search, date filters, and pagination via `search`, `dateFrom`, `dateTo`, `page`, and `pageSize` query parameters; the response includes pagination metadata plus the new `direction` field.

### Authentication

All transaction endpoints require a Bearer token:
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/transactions
```

## 3. Frontend

```bash
cd frontend
cp .env.example .env.local
# VITE_API_URL defaults to http://localhost:3000/api

npm install
npm run tokens:build
npm run dev
```

Open `http://localhost:5173`. Register or log in; the JWT is stored in **`localStorage`** under `fc_access_token` (session persists across reloads).

## Session policy (MVP)

- Stateless JWT on the server; no server-side session store.
- Client persists the token in `localStorage` (documented tradeoff: XSS surface — tighten for production).
- Never log tokens; use HTTPS outside local development.

## Scripts

| Location   | Command        | Purpose              |
|-----------|----------------|----------------------|
| `backend` | `npm run build` | Compile NestJS      |
| `backend` | `npm run lint`  | ESLint              |
| `frontend`| `npm run tokens:build` | Generate CSS variables from `tokens.json` |
| `frontend`| `npm run build` | Production bundle   |
| `frontend`| `npm run typecheck` | TypeScript check |
| `frontend`| `npm run lint`  | ESLint              |

## Frontend design tokens

- Source of truth: `frontend/src/design-system/tokens.json`
- Generated output: `frontend/src/design-system/tokens.css`
- Generator script: `frontend/scripts/generate-css-tokens.mjs`
- Compatibility layer: `frontend/src/index.css`

Current frontend CSS has been aligned to the generated token variables. If a new reusable design value is needed in CSS, add it to `tokens.json` first and then regenerate `tokens.css` instead of hardcoding it directly in a stylesheet.

## Verified commands

The following commands were executed successfully against the current implementation:

```bash
cd backend && npm run prisma:generate
cd backend && npm run prisma:migrate
cd backend && npm run build
cd backend && npm run lint
cd backend && npm run test
```

## Prisma schema

`backend/prisma/schema.prisma` is the source of truth. `DATABASE_URL` for **CLI** (migrate, generate) comes from `backend/.env` and `backend/prisma.config.ts` (Prisma 7).

At **runtime**, Prisma 7 expects a driver adapter when the datasource URL is not embedded in the generated client. This project uses `@prisma/adapter-pg` with the connection string from `DATABASE_URL` in `PrismaService` (see `backend/src/prisma/prisma.service.ts`).
