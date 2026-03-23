# Documento Técnico — Stack e Arquitetura

## 1. Objetivo

Definir as escolhas tecnológicas do sistema e padronizar a base de desenvolvimento do MVP.

---

## 2. Stack Principal

### Frontend
- React
- Vite
- TypeScript

### Backend
- NestJS
- TypeScript

### Banco de Dados
- PostgreSQL

### ORM
- Prisma

### Deploy
- Frontend: Vercel
- Backend: Vercel (serverless functions) ou alternativa (Render/Fly se necessário)

### Ambiente Local
- Docker
- docker-compose

---

## 3. Dependências Adicionais (essenciais)

### Frontend
- React Query (TanStack Query)
  - gerenciamento de estado server-side
  - cache e revalidação

- Zod
  - validação de dados
  - integração com forms e API

- React Hook Form
  - formulários performáticos

---

### Backend
- Zod
  - validação de DTOs

- class-transformer / class-validator (opcional, padrão Nest)

- JWT (jsonwebtoken)
  - autenticação

- bcrypt
  - hash de senha

---

### Dev / Infra
- pgAdmin ou Prisma Studio
  - visualização de dados

- ESLint + Prettier
  - padronização de código

- Husky
  - hooks de commit

---

## 4. Arquitetura

### 4.1 Backend (NestJS)

Arquitetura em camadas:

- Controllers
- Services
- Repositories (via Prisma)

Estrutura:

```
src/
  modules/
    auth/
    users/
    transactions/
    groups/
    couple/
  common/
  prisma/
```

---

### 4.2 Frontend (React)

Estrutura baseada em features:

```
src/
  features/
    auth/
    dashboard/
    transactions/
    groups/
    couple/
  components/
  services/
  hooks/
```

---

## 5. Comunicação

- REST API
- JSON

Padrão:
- GET /transactions
- POST /transactions
- GET /dashboard

---

## 6. Modelagem de Dados (alto nível)

Principais entidades:

- User
- Transaction
- Group
- GroupMember
- TransactionParticipant
- TransactionSplit

---

## 7. Autenticação

- JWT
- Login via email/senha
- Token armazenado no frontend

---

## 8. Ambiente Local (Docker)

Serviços:

- postgres
- backend
- frontend

Exemplo docker-compose:

- postgres: porta 5432
- backend: 3000
- frontend: 5173

---

## 9. Deploy

### Frontend
- Vercel (build automático via Git)

### Backend
Opções:
- Vercel (serverless)
- Render (mais simples para NestJS tradicional)

---

## 10. Decisões Técnicas

- SQL escolhido pela necessidade de consistência
- Prisma pela produtividade e tipagem forte
- React pela flexibilidade e ecossistema
- NestJS pela organização e escalabilidade

---

## 11. Fora do Escopo (agora)

- Microserviços
- Event-driven
- Filas (SQS, Kafka)
- Cache distribuído (Redis)

---

## 12. Evolução futura

Possíveis adições:

- Redis (cache)
- Sentry (monitoramento)
- OpenTelemetry (observabilidade)
- CI/CD (GitHub Actions)

---

## 13. Princípios

- Simplicidade primeiro
- Evitar overengineering
- Evoluir conforme necessidade

