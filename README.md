# Centro Financeiro Social — Epic 1 (foundation)

Monorepo layout: `backend/` (NestJS + Prisma + PostgreSQL), `frontend/` (Vite + React + TypeScript).

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

## 3. Frontend

```bash
cd frontend
cp .env.example .env.local
# VITE_API_URL defaults to http://localhost:3000/api

npm install
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
| `frontend`| `npm run build` | Production bundle   |
| `frontend`| `npm run typecheck` | TypeScript check |
| `frontend`| `npm run lint`  | ESLint              |

## Prisma schema

`backend/prisma/schema.prisma` is the source of truth. `DATABASE_URL` for **CLI** (migrate, generate) comes from `backend/.env` and `backend/prisma.config.ts` (Prisma 7).

At **runtime**, Prisma 7 expects a driver adapter when the datasource URL is not embedded in the generated client. This project uses `@prisma/adapter-pg` with the connection string from `DATABASE_URL` in `PrismaService` (see `backend/src/prisma/prisma.service.ts`).
