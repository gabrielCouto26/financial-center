# Páginas - Overview Visual

Descrição visual e funcional de cada página implementada.

---

## 1. Dashboard (`/`)

**Propósito**: Visão geral de todas as finanças

### Layout

```
┌─────────────────────────────────────────┐
│ HEADER (Logo, User Menu)                │
├──────────┬──────────────────────────────┤
│ SIDEBAR  │ ╔═ WELCOME CARD ═╗           │
│          │ ║ "Bem-vindo!"   ║           │
│ • Dashboard
│ • Personal   │ ║ [New] [Link]   ║           │
│ • Couple     │ ╚═══════════════╝           │
│ • Transactions     │                       │
│          │ ┌───────┬────────┬───────────┐ │
│          │ │ STATS │ STATS  │ STATS     │ │
│          │ │ Mês   │ Pessoal│ Casal     │ │
│          │ └───────┴────────┴───────────┘ │
│          │                               │
│          │ ╔════ RECENTES ════╗          │
│          │ ║ [Trans 1]        ║          │
│          │ ║ [Trans 2] → Ver  ║          │
│          │ ║ [Trans 3]  todos ║          │
│          │ ╚══════════════════╝          │
└──────────┴──────────────────────────────┘
```

### Componentes

| Componente | Tipo | Descrição |
|-----------|------|-----------|
| WelcomeCard | Glass Card | Boas-vindas com 2 CTAs |
| StatCard (4x) | Glass Card | Resumos em grid |
| TransactionListItem (5x) | List | Últimas transações |
| Link | Link | "Ver todos" para Transactions |

### Dados Mock

```typescript
{
  totalMonth: 1250.5,        // Total gasto este mês
  personalBalance: 5432.1,   // Saldo pessoal acumulado
  coupleBalance: 2180.75,    // Saldo casal vinculado
  groupBalance: 450.0,       // Transações em grupo
  recentTransactions: [...]  // Últimas 5-10
}
```

### Funcionalidades

- ✅ Resumo agregado de todas as áreas
- ✅ Acesso rápido para ações comuns
- ✅ Visualização das últimas movimentações
- ✅ Status de vinculação de parceiro

---

## 2. Personal (`/personal`)

**Propósito**: Análise detalhada das finanças pessoais

### Layout

```
┌─────────────────────────────────────────┐
│ HEADER                                  │
├──────────┬──────────────────────────────┤
│ SIDEBAR  │ [Título]                     │
│ • Dashboard
│          │ ┌─ PERÍODO ─┐  [M][T][6][A]  │
│ • Personal  │ [← Abr 2024 →] [Filtros] │
│ • Couple     │ └─────────┘              │
│ • Transactions     │                      │
│          │ ╔═ SUMMARY (GLASS) ═╗        │
│          │ ║ Este mês │ Mês ant│        │
│          │ ║ R$1250   │ R$1580 │        │
│          │ ║ Variação │ Acum.  │        │
│          │ ║   -20.8%  │ R$15k  │        │
│          │ ╚════════════════════╝        │
│          │                               │
│          │ ╔════ CATEGORIAS ════╗       │
│          │ ║  [Cat 1] 36%       ║       │
│          │ ║  [Cat 2] 22%       ║       │
│          │ ║  [Cat 3] 26%       ║       │
│          │ ║  [Cat 4] 16%       ║       │
│          │ ╚════════════════════╝       │
│          │                               │
│          │ ╔════ TRANSAÇÕES ════╗       │
│          │ ║ [T1] | [Filter ▼]  ║       │
│          │ ║ [T2]                ║       │
│          │ ║ [T3] | Scroll      ║       │
│          │ ╚════════════════════╝       │
└──────────┴──────────────────────────────┘
```

### Componentes

| Componente | Tipo | Descrição |
|-----------|------|-----------|
| PeriodSelector | Controls | Nav mês + pills |
| SummaryCard | Glass Card | 4 stats principais |
| CategoryBreakdown | Grid | Cards de categorias |
| TransactionList | List | Completa com filtros |

### Dados Mock

```typescript
{
  period: "Mês",
  thisMonth: 1250.5,
  lastMonth: 1580.25,
  accumulated: 15430.2,
  variation: -20.8,
  categories: [
    { name: "Alimentação", value: 450, percentage: 36 },
    // ...
  ],
  transactions: [...]
}
```

### Funcionalidades

- ✅ Período selecionável (mês/trimestre/ano)
- ✅ Comparação com período anterior
- ✅ Breakdown visual por categoria
- ✅ Histórico completo com filtros
- ✅ Cálculo de variação automático

---

## 3. Couple (`/couple`)

**Propósito**: Gerenciar despesas compartilhadas

### Layout (Vinculado)

```
┌─────────────────────────────────────────┐
│ HEADER                                  │
├──────────┬──────────────────────────────┤
│ SIDEBAR  │ [Título] [Status: Vinc.]    │
│ • Dashboard
│          │ ╔════════ HERO ════════╗    │
│ • Personal  │ ║ Saldo Total Compar.║    │
│ • Couple    │ ║ R$ 5.420,50        ║    │
│ • Transactions │ ║ [Sincronizado ✓]   ║    │
│          │ ║         [Icon]         ║    │
│          │ ╚════════════════════════╝    │
│          │                               │
│          │ ┌─ BENTO GRID ─┐             │
│          │ │ [Você]   [PA]│             │
│          │ │  Pgou        │ Pgou        │
│          │ │  R$3.2k      │ R$2.2k      │
│          │ ├─────────────┤             │
│          │ │[Acertos][Cat]│             │
│          │ │Deve R$489    │ Compar.     │
│          │ │[Pagar Agora] │ de gast.   │
│          │ │              │             │
│          │ │[Parceiro]    │             │
│          │ │[Avatar]      │             │
│          │ │Maria Silva   │             │
│          │ │[Desvincular] │             │
│          │ └──────────────┘             │
│          │                               │
│          │ ╔════ COMPARTILHADAS ╗      │
│          │ ║ [Aluguel]          ║      │
│          │ ║ [Internet]         ║      │
│          │ ║ [Restaurante]      ║      │
│          │ ║ [Cinema]           ║      │
│          │ ╚════════════════════╝      │
└──────────┴──────────────────────────────┘
```

### Componentes

| Componente | Tipo | Descrição |
|-----------|------|-----------|
| Hero Card | Glass Card | Saldo total com status |
| Balance Cards (2x) | Cards | Balanço bilateral |
| Settlement Card | Card | Acertos de contas |
| Categories Card | Card | Breakdown comparativo |
| Partner Card | Card | Info do parceiro |
| Transactions | List | Despesas compartilhadas |

### Estados

**Desvinculado:**
```
┌──────────────────────┐
│ [Ícone de Link]      │
│ Vincular Parceiro    │
│ Insira o email...    │
│ [Input email]        │
│ [Botão Vincular]     │
└──────────────────────┘
```

### Dados Mock

```typescript
{
  isLinked: true,
  totalBalance: 5420.5,
  youPaid: 3200,
  yourPart: 2710.25,
  partnerPaid: 2220.5,
  partnerPart: 2710.25,
  whoOwes: "partner",
  owesAmount: 489.75,
  partner: {
    name: "Maria Silva",
    email: "maria@example.com",
    initials: "MS"
  }
}
```

### Funcionalidades

- ✅ Vinculação de parceiro por email
- ✅ Balanço bilateral automático
- ✅ Cálculo de quem deve para quem
- ✅ Breakdown por categoria (comparativo)
- ✅ Liquidação de débitos
- ✅ Desvincular parceiro

---

## 4. Transactions (`/transactions`)

**Propósito**: View avançada com filtros e 2 modos de visualização

### Layout - LIST VIEW (Default)

```
┌─────────────────────────────────────────┐
│ HEADER                                  │
├──────────┬──────────────────────────────┤
│ SIDEBAR  │ [Título]                     │
│          │                               │
│          │ ╔═ FILTROS ═╗                │
│ • Dashboard        │ [Search input]      │
│ • Personal │ ┌───────┬───────┬────────┐ │
│ • Couple   │ │ Tipo  │ Dir.  │ Cat.   │ │
│ • Transactions   │ ├───────┼───────┼────────┤ │
│          │ │ [List] [Timeline] │
│          │ └───────┴───────┴────────┘ │
│          │ ╚════════════════════════╝  │
│          │                               │
│          │ ╔═ STATS ═╗                  │
│          │ ║ 12 txs │ +R$3.5k | -R$2.2k │
│          │ ║        │ Líquido: R$1.3k    │
│          │ ╚════════════════════════════╝
│          │                               │
│          │ ╔════ LISTA ════╗            │
│          │ ║ [Hoje]        ║            │
│          │ ║ [Trans 1]     ║            │
│          │ ║ [Trans 2]     ║            │
│          │ ║              ║            │
│          │ ║ [Ontem]       ║            │
│          │ ║ [Trans 3]     ║            │
│          │ ║ [Trans 4]     ║            │
│          │ ║ Scroll...     ║            │
│          │ ╚═══════════════╝            │
│          │                               │
│          │      [+ Nova Transação] FAB   │
└──────────┴──────────────────────────────┘
```

### Layout - TIMELINE VIEW

```
┌──────────────────┐
│ ╔════════════════╗│
│ ║ [Hoje]        ║│
│ ║ ●─[Trans 1]   ║│
│ ║│ ●─[Trans 2]  ║│
│ ║                ║│
│ ║ [Ontem]       ║│
│ ║ ●─[Trans 3]   ║│
│ ║│ ●─[Trans 4]  ║│
│ ║│                ║│
│ ║ [2 dias atrás] ║│
│ ║ ●─[Trans 5]   ║│
│ ║ Scroll...      ║│
│ ╚════════════════╝│
└──────────────────┘
```

### Componentes

| Componente | Tipo | Descrição |
|-----------|------|-----------|
| Search & Filters | Controls | Input + 3 selects |
| Stats Grid | Cards | 4 números principais |
| List View | List | Agrupado por data |
| Timeline View | Timeline | Visual com linha |
| FAB | Button | CTA flutuante |

### Filtros Disponíveis

```typescript
{
  search: string,           // Nome da transação
  type: "all" | "personal" | "couple" | "group",
  direction: "all" | "income" | "expense",
  category: "all" | "Alimentação" | "Transporte" | ...
}
```

### Dados Mock

```typescript
const transactions = [
  {
    id: "1",
    name: "Supermercado",
    category: "Alimentação",
    value: 125.5,
    date: "2024-04-23",
    type: "expense",
    transactionType: "personal"
  },
  // ... mais 5 transações
]
```

### Funcionalidades

- ✅ Busca por nome/descrição
- ✅ Filtros por tipo, direção, categoria
- ✅ 2 modos de visualização (list/timeline)
- ✅ Agrupamento automático por data
- ✅ Estatísticas em tempo real
- ✅ CTA flutuante para nova transação

---

## Comparação de Páginas

| Aspecto | Dashboard | Personal | Couple | Transactions |
|--------|-----------|----------|--------|--------------|
| **Foco** | Overview | Detalhes | Compartilhadas | Completo |
| **Período** | Atual | Selecionável | Vinculação | Filtrado |
| **Visualização** | Cards | Grid + List | Bento-grid | List + Timeline |
| **Interação** | Alta | Alta | Alta | Muito alta |
| **Filtros** | Nenhum | 1 (período) | Nenhum | 4 (avançados) |
| **Mock data** | 4 stats + 5 tx | 1 período + 4 cat | Status + 4 cat | 6 transações |

---

## Fluxos Comuns

### Fluxo 1: Ver gastos de hoje
1. Ir para Dashboard
2. Ver TransactionList (últimas)
3. Ou clicar "Ver tudo" → Transactions

### Fluxo 2: Analisar gastos pessoais
1. Ir para Personal
2. Selecionar período
3. Ver CategoryBreakdown
4. Explorar com filtros em TransactionList

### Fluxo 3: Acertar contas com parceiro
1. Ir para Couple
2. Ver Settlement Card (quem deve)
3. Clicar "Pagar Agora"
4. Acompanhar em TransactionList

### Fluxo 4: Buscar transação específica
1. Ir para Transactions
2. Usar Search input
3. Filtrar por tipo/categoria
4. Ver em List ou Timeline

---

## Padrões de Interação

### Hover States
- Todos os cards: `translateY(-4px) + shadow`
- Buttons: cor mais clara + shadow
- Links: cor mais clara + underline

### Loading States
- Buttons: spinner inline
- Cards: skeleton placeholders
- Lists: placeholder rows

### Empty States
- Nenhuma transação: icon + mensagem
- Sem parceiro vinculado: card com CTA
- Sem filtros: mostrar todos

### Error States
- API error: toast notification
- Validation error: highlight field
- Network error: retry button

---

## Tipografias Usadas

### Headings
- `h1`: Dashboard / Personal / Couple / Transactions (32px)
- `h2`: Section headers (28px)
- `h3`: Card titles / Subsections (24px)
- `h4`: Component titles (20px)

### Body
- `label`: Labels + small info (12px uppercase)
- `body-md`: Conteúdo principal (14px)
- `body-lg`: Stats values (16px)

---

## Cores por Contexto

| Elemento | Cor | Uso |
|---------|-----|-----|
| CTA Primária | Roxo #6B5FFF | Ações principais |
| Links | Ciano #00D4FF | Navegação |
| Receitas | Verde #00D084 | Valores positivos |
| Despesas | Vermelho #FF6B6B | Valores negativos |
| Warning | Laranja #FFB84D | Avisos |

---

Última atualização: 2024
Status: Production Ready
