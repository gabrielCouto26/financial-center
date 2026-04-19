# Dependency Auditor Report

**Repository:** `financial-center`  
**Ecosystems audited:** Node.js (pnpm workspace)  
**Python:** No `requirements.txt`, `pyproject.toml`, or `Pipfile` found — not audited.  
**Lockfile:** `pnpm-lock.yaml` present (lockfileVersion 9.0) — reproducible installs are supported.  
**Evidence sources:** `pnpm audit` (npm advisory database), `pnpm outdated -r`, `pnpm list -r --depth 0` (2026-04-19).  
**Constraint:** This report does not modify code or lockfiles and does not run upgrade commands.

---

### Summary

The workspace defines **68 direct dependency entries** across three projects (`financial-center` root, `apps/backend`, `apps/frontend`). The resolved dependency tree contains **939** total packages per `pnpm audit` metadata.

**Security posture (npm advisory database):** No **Critical** or **High** severities reported. **2** findings at **Moderate** severity, both **transitive** under `prisma` → `@prisma/dev` → `hono` / `@hono/node-server` (dev-time tooling, not imported by application source in this repository).

**Version drift:** Multiple direct dependencies are behind the latest published versions; several gaps are **major-version** bumps (e.g. `eslint` 9 → 10, `typescript` 5 → 6, `vite` 6 → 8, `zod` 3 → 4), which typically imply breaking changes in those ecosystems.

**Maintenance health (12+ months without updates):** Per-package “last published” timestamps were **not** verified package-by-package in this run. To validate the audit criterion (“no updates in 12+ months”), use registry metadata (e.g. `npm view <package> time`) or a dedicated SCA tool with maintenance signals.

**Licensing:** Manifests show root **ISC** and backend **UNLICENSED** (private). A full license compatibility / SPDX inventory across the tree was **not** generated in this run.

**Single points of failure:** The database layer is centralized in Prisma + PostgreSQL (`prisma.service.ts`); frontend data fetching is centralized on TanStack Query defaults in `main.tsx` / `queryClient.ts`. No alternate registry or multi-origin supply-chain review was performed.

---

### Critical Vulnerabilities

**None** reported by `pnpm audit` at Critical or High severity for the analyzed tree.

The following **Moderate** items were reported (included here because they are the only advisory-backed findings; they are **not** classified as Critical in the database):

| Advisory | CVE / ID | Package | Resolved version (in tree) | Severity (DB) |
| :--- | :--- | :--- | :--- | :--- |
| [GHSA-92pp-h63x-v22m](https://github.com/advisories/GHSA-92pp-h63x-v22m) | **CVE-2026-39406** | `@hono/node-server` | 1.19.11 | Moderate |
| [GHSA-458j-xx4x-4375](https://github.com/advisories/GHSA-458j-xx4x-4375) | No CVE assigned in advisory metadata | `hono` | 4.12.12 | Moderate |

**Dependency path (from audit):** `apps/backend` → `prisma` → `@prisma/dev` → `@hono/node-server` / `hono`.

---

### Dependencies Table

Direct dependencies only. **Current** = resolved version from `pnpm list -r --depth 0`. **Latest** = registry latest at time of `pnpm outdated -r` where available; “—” = not reported as outdated in that run.

#### Root (`financial-center`)

| Dependency | Current Version | Latest Version | Status |
| :--- | :--- | :--- | :--- |
| @google/generative-ai | 0.24.1 | — | Current per outdated scan |
| @types/node | 25.6.0 | — | Current per outdated scan |
| dotenv | 17.4.1 | 17.4.2 | Outdated (patch) |
| husky | 9.1.7 | — | Current per outdated scan |
| lint-staged | 16.4.0 | — | Current per outdated scan |
| tsx | 4.21.0 | — | Current per outdated scan |

#### `apps/backend`

| Dependency | Current Version | Latest Version | Status |
| :--- | :--- | :--- | :--- |
| @nestjs/common | 11.1.18 | 11.1.19 | Outdated (patch) |
| @nestjs/config | 4.0.4 | — | Current per outdated scan |
| @nestjs/core | 11.1.18 | 11.1.19 | Outdated (patch) |
| @nestjs/jwt | 11.0.2 | — | Current per outdated scan |
| @nestjs/passport | 11.0.5 | — | Current per outdated scan |
| @nestjs/platform-express | 11.1.18 | 11.1.19 | Outdated (patch) |
| @prisma/adapter-pg | 7.7.0 | — | Current per outdated scan |
| @prisma/client | 7.7.0 | — | Current per outdated scan |
| bcrypt | 6.0.0 | — | Current per outdated scan |
| class-transformer | 0.5.1 | — | Current per outdated scan |
| class-validator | 0.15.1 | — | Current per outdated scan |
| dotenv | 17.4.1 | 17.4.2 | Outdated (patch) |
| passport | 0.7.0 | — | Current per outdated scan |
| passport-jwt | 4.0.1 | — | Current per outdated scan |
| pg | 8.20.0 | — | Current per outdated scan |
| reflect-metadata | 0.2.2 | — | Current per outdated scan |
| rxjs | 7.8.2 | — | Current per outdated scan |
| @eslint/eslintrc | 3.3.5 | — | Current per outdated scan |
| @eslint/js | 9.39.4 | 10.0.1 | Outdated (**major** — likely breaking) |
| @nestjs/cli | 11.0.19 | 11.0.21 | Outdated (patch) |
| @nestjs/schematics | 11.0.10 | 11.1.0 | Outdated (minor) |
| @nestjs/testing | 11.1.18 | 11.1.19 | Outdated (patch) |
| @types/bcrypt | 6.0.0 | — | Current per outdated scan |
| @types/express | 5.0.6 | — | Current per outdated scan |
| @types/jest | 30.0.0 | — | Current per outdated scan |
| @types/node | 22.19.17 | 25.6.0 | Outdated (major line difference vs root) |
| @types/passport-jwt | 4.0.1 | — | Current per outdated scan |
| @types/pg | 8.20.0 | — | Current per outdated scan |
| @types/supertest | 6.0.3 | 7.2.0 | Outdated (major) |
| eslint | 9.39.4 | 10.2.1 | Outdated (**major** — likely breaking) |
| eslint-config-prettier | 10.1.8 | — | Current per outdated scan |
| eslint-plugin-prettier | 5.5.5 | — | Current per outdated scan |
| globals | 16.5.0 | 17.5.0 | Outdated (major) |
| jest | 30.3.0 | — | Current per outdated scan |
| prettier | 3.8.2 | 3.8.3 | Outdated (patch) |
| prisma | 7.7.0 | — | Current per outdated scan |
| source-map-support | 0.5.21 | — | Current per outdated scan |
| supertest | 7.2.2 | — | Current per outdated scan |
| ts-jest | 29.4.9 | — | Current per outdated scan |
| ts-loader | 9.5.7 | — | Current per outdated scan |
| ts-node | 10.9.2 | — | Current per outdated scan |
| tsconfig-paths | 4.2.0 | — | Current per outdated scan |
| typescript | 5.7.3 | 6.0.3 | Outdated (**major** — likely breaking) |
| typescript-eslint | 8.58.1 | 8.58.2 | Outdated (patch) |

#### `apps/frontend`

| Dependency | Current Version | Latest Version | Status |
| :--- | :--- | :--- | :--- |
| @hookform/resolvers | 5.2.2 | — | Current per outdated scan |
| @tanstack/react-query | 5.99.0 | 5.99.1 | Outdated (patch) |
| react | 19.2.5 | — | Current per outdated scan |
| react-dom | 19.2.5 | — | Current per outdated scan |
| react-hook-form | 7.72.1 | — | Current per outdated scan |
| react-router-dom | 7.14.0 | 7.14.1 | Outdated (patch) |
| zod | 3.25.76 | 4.3.6 | Outdated (**major** — likely breaking) |
| @eslint/js | 9.39.4 | 10.0.1 | Outdated (**major** — likely breaking) |
| @types/react | 19.2.14 | — | Current per outdated scan |
| @types/react-dom | 19.2.3 | — | Current per outdated scan |
| @vitejs/plugin-react | 4.7.0 | 6.0.1 | Outdated (**major** — likely breaking) |
| eslint | 9.39.4 | 10.2.1 | Outdated (**major** — likely breaking) |
| eslint-plugin-react-hooks | 5.2.0 | 7.1.1 | Outdated (**major** — likely breaking) |
| eslint-plugin-react-refresh | 0.4.26 | 0.5.2 | Outdated (minor) |
| globals | 16.5.0 | 17.5.0 | Outdated (major) |
| typescript | 5.7.3 | 6.0.3 | Outdated (**major** — likely breaking) |
| typescript-eslint | 8.58.1 | 8.58.2 | Outdated (patch) |
| vite | 6.4.2 | 8.0.8 | Outdated (**major** — likely breaking) |

---

### Risk Analysis

| Severity | Dependency | Issue | Details |
| :--- | :--- | :--- | :--- |
| Medium | `hono` (transitive) | Known advisory **GHSA-458j-xx4x-4375** | SSR/JSX attribute handling; **no CVE ID** in advisory metadata at time of audit. Path: `prisma` → `@prisma/dev` → `hono`. |
| Medium | `@hono/node-server` (transitive) | Known advisory **GHSA-92pp-h63x-v22m**, **CVE-2026-39406** | `serveStatic` / middleware path handling. Path: `prisma` → `@prisma/dev` → `@hono/node-server`. |
| Low | Multiple direct deps | Behind latest major versions | Increases friction for security backports and compatibility testing; not automatically vulnerabilities. |
| Informational | `@types/node` (backend vs root) | Different major lines (22.x vs 25.x) | Risk is **consistency/type drift** across tooling, not a CVE by itself. |

---

### Unidentified Vulnerabilities

- **Transitive packages not individually reviewed:** Only the aggregated `pnpm audit` result was used for CVE-backed findings. Deeper transitive review (e.g. full SBOM + alternate databases) was not performed.
- **Non-npm sources:** Supply-chain risk outside the npm advisory database is out of scope for this run.
- **Maintenance “stale” flag:** Not computed per package in this run (see Summary).

---

### Critical File Mapping

**Packages with advisory findings (`hono`, `@hono/node-server`):** No files under `apps/` import these modules. Exposure is tied to the **Prisma** dev dependency chain (`@prisma/dev`), not runtime API code.

**High-touch files for security-sensitive direct dependencies and data access:**

| # | Path | Relevance |
| :---: | :--- | :--- |
| 1 | `apps/backend/src/prisma/prisma.service.ts` | Central `PrismaClient` + PostgreSQL adapter; all persisted data flows through here. |
| 2 | `apps/backend/src/auth/auth.service.ts` | Authentication logic; pairs with JWT and password hashing concerns. |
| 3 | `apps/backend/src/auth/jwt.strategy.ts` | JWT validation (`passport-jwt`); gate for protected routes. |
| 4 | `apps/backend/src/auth/auth.module.ts` | Wires NestJS JWT and Passport modules. |
| 5 | `apps/backend/src/main.ts` | Application bootstrap and global middleware. |
| 6 | `apps/backend/src/app.module.ts` | Root module composition. |
| 7 | `apps/backend/prisma.config.ts` | Prisma configuration entry (tooling chain that includes audited transitive deps). |
| 8 | `apps/backend/src/transactions/transactions.controller.ts` | HTTP surface for transaction mutations (authorization boundary). |
| 9 | `apps/frontend/src/main.tsx` | React bootstrap, router, React Query provider. |
| 10 | `apps/frontend/src/features/auth/LoginPage.tsx` | Credential submission surface (client-side; pairs with backend auth). |

---

### Integration Notes

- **Backend:** NestJS HTTP API with **Passport JWT**, **bcrypt**, **class-validator** / **class-transformer**, and **Prisma** over **pg** via `@prisma/adapter-pg`.
- **Frontend:** **Vite** + **React 19**, routing via **react-router-dom**, server state via **@tanstack/react-query**, forms via **react-hook-form** + **zod** + **@hookform/resolvers**.
- **Root:** **Husky**, **lint-staged**, **tsx**, and **@google/generative-ai** for scripts/tooling (see `package.json` scripts).

---

### Action Plan

1. **Reconcile advisory findings for the Prisma toolchain:** Track Prisma releases where `@prisma/dev` pulls patched `hono` / `@hono/node-server` versions, then re-run `pnpm audit` after lockfile updates when the team chooses to upgrade dependencies.
2. **Confirm runtime vs dev-only scope:** Document that current `hono`-related advisories originate under `@prisma/dev` so stakeholders do not confuse them with production HTTP handlers in this codebase.
3. **Plan major upgrades deliberately:** TypeScript 6, ESLint 10, Vite 8, Zod 4, and related plugins imply **breaking** ecosystem changes — schedule dedicated upgrade tasks with test and lint validation.
4. **Align Node types:** Decide on a single `@types/node` major line for backend (and tooling) to reduce type inconsistencies.
5. **Add maintenance monitoring:** Optionally introduce automated checks for publish staleness and license policy if compliance requires it (not executed in this audit).

---

*End of report.*
