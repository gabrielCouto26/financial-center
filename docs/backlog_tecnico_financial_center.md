# Backlog Técnico — Financial Center

## 1. Visão

Backlog estruturado em:
- Épicos
- Histórias de Usuário
- Critérios de Aceite
- Tasks técnicas

Escopo: MVP definido no PRD.

---

## 2. Épico 1 — Fundação do Projeto

### História 1.1 — Setup do projeto
**Como** desenvolvedor
**Quero** inicializar o projeto web
**Para** começar o desenvolvimento

**Critérios de aceite**
- Projeto roda localmente
- Estrutura base definida

**Tasks**
- Inicializar repositório
- Setup frontend (React + Vite ou similar)
- Setup backend (Node + NestJS ou similar)
- Configurar TypeScript
- Configurar lint + formatter

---

### História 1.2 — Autenticação básica
**Como** usuário
**Quero** criar conta e logar
**Para** acessar meus dados

**Critérios de aceite**
- Cadastro por email/senha
- Login funcional
- Sessão persistida

**Tasks**
- Model user
- Endpoint de cadastro
- Endpoint de login
- Hash de senha
- Middleware de autenticação

---

## 3. Épico 2 — Transações

### História 2.1 — Criar despesa pessoal
**Como** usuário
**Quero** adicionar uma despesa
**Para** controlar meus gastos

**Critérios de aceite**
- Campos obrigatórios salvos
- Aparece na dashboard

**Tasks**
- Model Transaction
- Endpoint POST /transactions
- Form frontend
- Validação de campos

---

### História 2.2 — Listar transações
**Como** usuário
**Quero** ver minhas despesas

**Critérios de aceite**
- Lista ordenada por data

**Tasks**
- Endpoint GET /transactions
- UI lista

---

### História 2.3 — Categorias
**Como** usuário
**Quero** categorizar despesas

**Critérios de aceite**
- Categoria salva e exibida

**Tasks**
- Enum de categorias
- Dropdown no frontend

---

## 4. Épico 3 — Casal

### História 3.1 — Vincular parceiro
**Como** usuário
**Quero** adicionar parceiro

**Critérios de aceite**
- Usuários vinculados

**Tasks**
- Model relationship
- Endpoint vinculação

---

### História 3.2 — Criar despesa de casal
**Como** usuário
**Quero** dividir uma despesa

**Critérios de aceite**
- Divisão 50/50 padrão
- Percentual customizado possível

**Tasks**
- Suporte a participants
- Campo splits
- Validação soma 100%

---

### História 3.3 — Cálculo de saldo casal
**Como** usuário
**Quero** saber quem deve quanto

**Critérios de aceite**
- Valor correto exibido

**Tasks**
- Função de cálculo
- Endpoint /couple/balance

---

## 5. Épico 4 — Grupos

### História 4.1 — Criar grupo
**Como** usuário
**Quero** criar grupo

**Critérios de aceite**
- Grupo persistido

**Tasks**
- Model Group
- Endpoint POST /groups

---

### História 4.2 — Adicionar membros

**Critérios de aceite**
- Usuários adicionados

**Tasks**
- Endpoint add member

---

### História 4.3 — Despesas em grupo

**Critérios de aceite**
- Divisão igual e percentual

**Tasks**
- Reuso de Transaction

---

### História 4.4 — Cálculo de saldo grupo

**Critérios de aceite**
- Quem deve quem calculado

**Tasks**
- Algoritmo simples de saldo

---

## 6. Épico 5 — Dashboard

### História 5.1 — Resumo financeiro

**Critérios de aceite**
- Total do mês
- Saldo atual

**Tasks**
- Query agregada
- UI cards

---

### História 5.2 — Bloco casal

**Critérios de aceite**
- Débito/crédito exibido

**Tasks**
- Endpoint agregado

---

### História 5.3 — Bloco grupos

**Critérios de aceite**
- Saldo simplificado

**Tasks**
- Agregação por grupo

---

### História 5.4 — Lista recente

**Critérios de aceite**
- Últimas transações

**Tasks**
- Query limitada

---

## 7. Épico 6 — UI/UX

### História 6.1 — Sidebar

**Critérios de aceite**
- Navegação funcional

**Tasks**
- Componente sidebar

---

### História 6.2 — Fluxo adicionar despesa

**Critérios de aceite**
- Fluxo < 10 segundos

**Tasks**
- Modal/form rápido

---

## 8. Épico 7 — Regras de Negócio

### História 7.1 — Divisão percentual

**Critérios de aceite**
- Soma 100%

**Tasks**
- Validação backend

---

### História 7.2 — Cálculo de saldo

**Critérios de aceite**
- Consistência global

**Tasks**
- Função central de cálculo

---

## 9. Épico 8 — Infra (mínimo)

### História 8.1 — Banco de dados

**Tasks**
- Setup PostgreSQL
- Migrations

---

### História 8.2 — Deploy simples

**Tasks**
- Backend (Render/Fly)
- Frontend (Vercel)

---

## 10. Priorização (MVP)

Ordem de entrega:
1. Fundação
2. Transações pessoais
3. Dashboard básico
4. Casal
5. Grupos

---

## 11. Definição de Pronto

- Feature testada manualmente
- Sem erros críticos
- Fluxo principal funcionando
- Deploy em ambiente acessível

