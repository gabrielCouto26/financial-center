# Design System - Financial Center

## Visão Geral

O Design System do Financial Center é um sistema de design completo com tokens centralizados, componentes reutilizáveis e guidelines de estilo para uma experiência de usuário consistente.

---

## Tokens

Todos os tokens estão definidos em `src/design-system/tokens.json` e são automaticamente convertidos para CSS variables em `src/design-system/tokens.css`.

### Cores

Paleta com 5 cores principais + neutrals:

- **Primária**: `#6B5FFF` (roxo premium) - CTA, estados ativos, destaques
- **Secundária**: `#00D4FF` (ciano) - Links, accents, informações
- **Sucesso**: `#00D084` (verde) - Valores positivos, receitas
- **Perigo**: `#FF6B6B` (vermelho) - Valores negativos, despesas, alertas
- **Aviso**: `#FFB84D` (laranja) - Avisos, chamadas de atenção
- **Background**: `#0F0F1B` (dark navy) - Fundo principal
- **Surface**: `#25254A` (dark purple) - Cards e containers
- **Text**: `#FFFFFF` (branco) + variações de cinza

### Tipografia

Duas famílias de fonte:
- **Plus Jakarta Sans**: Headings (h1-h4)
- **Inter**: Body text, labels

Tamanhos:
- `heading-xl`: 32px (600)
- `heading-lg`: 28px (600)
- `heading-md`: 24px (600)
- `heading-sm`: 20px (600)
- `body-lg`: 16px (400)
- `body-md`: 14px (400)
- `body-sm`: 12px (400)
- `label`: 12px (500, uppercase)

### Espaçamento

Sistema de 4px base:
- `xs`: 4px
- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 20px
- `2xl`: 24px
- `3xl`: 32px
- etc.

### Border Radius

- `xs`: 4px
- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 20px
- `full`: 9999px (circles)

### Sombras

- `sm`: Subtle shadows (inputs, small cards)
- `md`: Medium shadows (cards)
- `lg`: Large shadows (modals, dropdowns)
- `xl`: Extra large shadows (floating elements)
- `2xl`: Maximum shadows (overlays)
- `glass`: Special blur effect for glass-morphism

### Transições

- `fast`: 150ms
- `base`: 200ms
- `slow`: 300ms

---

## Componentes Atômicos

Componentes base reutilizáveis em `src/design-system/components/`:

### Button

Variantes: `primary`, `secondary`, `danger`, `ghost`
Tamanhos: `sm`, `md`, `lg`

```tsx
<Button variant="primary" size="md" isLoading={false}>
  Enviar
</Button>
```

### Card

Variantes: `default` (surface com border), `glass` (blur effect), `minimal`
Padding: `sm`, `md`, `lg`

```tsx
<Card variant="glass" padding="lg" interactive>
  Conteúdo do card
</Card>
```

### Input

Com suporte a label, erro, helper text, ícone.

```tsx
<Input
  label="Email"
  type="email"
  placeholder="seu@email.com"
  error={erro}
  icon={<IconMail />}
  fullWidth
/>
```

### Badge

Variantes: `primary`, `secondary`, `success`, `danger`, `warning`, `default`
Tamanhos: `sm`, `md`

```tsx
<Badge variant="success" size="md">
  Ativo
</Badge>
```

### Avatar

Tamanhos: `sm` (32px), `md` (40px), `lg` (56px), `xl` (80px)

```tsx
<Avatar src="url" alt="Name" initials="JD" size="md" />
```

### Label

Com suporte a indicador de obrigatoriedade.

```tsx
<Label required>Seu nome</Label>
```

### Pill

Buttons arredondados para seleção e filtros.

```tsx
<Pill isActive={active} onClick={() => {}}>
  Filtro
</Pill>
```

---

## Componentes de Funcionalidade

Componentes específicos de features:

### StatCard

Card para exibição de estatísticas com ícone.

```tsx
<StatCard
  label="Total do mês"
  value="R$ 1.250,50"
  color="primary"
  icon={<BalanceIcon />}
/>
```

### TransactionListItem

Item individual de transação.

```tsx
<TransactionListItem
  name="Supermercado"
  category="Alimentação"
  value={125.5}
  date="Hoje"
  type="expense"
  categoryColor="#FF6B6B"
/>
```

### CategoryBreakdown

Grid de categorias com visualização de percentuais.

```tsx
<CategoryBreakdown categories={categories} total={1250} />
```

---

## Layout Principal

### DashboardLayout

Container principal que envolve toda a aplicação com Header e Sidebar.

Estrutura:
- **Header** (sticky): Logo, user menu, notifications
- **Sidebar**: Navegação principal (280px em desktop, colapsável em mobile)
- **Main content**: Área de scroll com padding

Responsividade:
- Desktop (>768px): Sidebar fixo à esquerda
- Mobile (<768px): Sidebar colapsável com overlay

---

## Páginas

### Dashboard (`/`)

**Componentes:**
- WelcomeCard: Boas-vindas com CTAs
- StatCard (4x): Resumos de saldo, pessoal, casal, grupos
- TransactionList: Últimas 5-10 transações

**Features:**
- Resumo agregado
- Links rápidos para outras áreas
- Overview de todas as finanças

### Personal (`/personal`)

**Componentes:**
- PeriodSelector: Seleção de período
- SummaryCard: Total do mês, mês anterior, variação, acumulado
- CategoryBreakdown: Grid de categorias com percentuais
- TransactionList com filtros

**Features:**
- Analytics mensais
- Breakdown por categoria
- Histórico completo com filtros

### Couple (`/couple`)

**Layout:** Bento-grid com cards de diferentes tamanhos

**Componentes:**
- Hero card: Saldo total compartilhado
- Balance cards (2x): Seu balanço + Parceiro
- Settlement card: Quem deve para quem
- Categories breakdown: Comparação de gastos
- Partner profile: Info do parceiro
- Shared transactions: Lista de despesas compartilhadas

**Features:**
- Vinculação de parceiro (email)
- Balanço bilateral
- Liquidação de débitos
- Comparação de gastos

### Transactions (`/transactions`)

**Componentes:**
- Search & Filters: Busca, tipo, direção, categoria
- Stats: 4 cards com totais filtrados
- List ou Timeline: 2 modos de visualização
- FAB: Botão flutuante para nova transação

**Features:**
- Filtros avançados
- 2 modos de visualização (lista/timeline)
- Estatísticas em tempo real
- Agrupamento por data

---

## Padrões CSS

### Variáveis CSS

Todas as valores usam variáveis CSS de tokens:

```css
.elemento {
  background-color: var(--color-primary);
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  font-size: var(--font-size-body-md);
  transition: all var(--transition-base);
}
```

### BEM Naming

Componentes seguem padrão BEM:

```css
.component {
}

.component__element {
}

.component__element--modifier {
}
```

### Responsividade

Mobile-first approach:

```css
@media (max-width: 768px) {
  /* Mobile styles */
}

@media (max-width: 480px) {
  /* Small mobile styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}
```

---

## Estados e Interações

### Hover/Focus

Todos os elementos interativos têm estados:
- Cor primária no border/background
- Transform Y negativo (elevação)
- Shadow aumentada
- Transição suave

### Loading

Spinner em botões:
```tsx
<Button isLoading={true}>Enviando...</Button>
```

### Erros

Inputs com erro:
- Border vermelho
- Background com tint de erro
- Mensagem de erro abaixo

---

## Acessibilidade

- Semântica HTML adequada (buttons, labels, etc.)
- Roles e aria-labels quando necessário
- Ordem de tab lógica
- Contraste adequado (WCAG AA)
- Textos informativos para screen readers (.sr-only)

---

## Build e Tokens

### Gerar CSS dos Tokens

```bash
npm run tokens:build
```

Cria `src/design-system/tokens.css` a partir de `tokens.json`.

### Importar Tokens

```tsx
// No arquivo CSS/TSX
@import './design-system/tokens.css';

// Usar variáveis
background-color: var(--color-primary);
```

---

## Performance

- **Lazy loading**: Páginas carregadas sob demanda
- **CSS otimizado**: Sem duplicação, variáveis reutilizadas
- **Imagens**: Otimizadas e responsivas
- **Animações**: GPU-accelerated (transform, opacity)

---

## Extensão e Manutenção

### Adicionar nova cor

1. Editar `tokens.json`
2. Rodar `npm run tokens:build`
3. Usar em CSS: `var(--color-novo)`

### Criar novo componente

1. Pasta em `src/design-system/components/`
2. Arquivo `.tsx` + `.css`
3. Exportar em `index.ts`
4. Importar onde usar: `import { Component } from '@/design-system/components'`

### Adicionar nova página

1. Pasta em `src/features/[nome]/`
2. `[Nome]Page.tsx` + `[Nome]Page.css`
3. Components auxiliares em `components/` subpasta
4. Importar em `App.tsx`
5. Adicionar rota em `DashboardLayout`

---

## Referências

- **Tokens**: `src/design-system/tokens.json`
- **Global CSS**: `src/index.css`
- **Componentes**: `src/design-system/components/`
- **Páginas**: `src/features/*/`
- **Layout**: `src/layout/`
