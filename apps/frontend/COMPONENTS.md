# Componentes - Guia de Uso

Exemplos de como usar cada componente do design system.

## Índice

1. [Button](#button)
2. [Card](#card)
3. [Input](#input)
4. [Badge](#badge)
5. [Avatar](#avatar)
6. [Label](#label)
7. [Pill](#pill)
8. [StatCard](#statcard)
9. [TransactionListItem](#transactionlistitem)
10. [CategoryBreakdown](#categorybreakdown)

---

## Button

Componente de botão reutilizável com variantes, tamanhos e estados.

### Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  children: ReactNode;
}
```

### Exemplos

```tsx
import { Button } from '@/design-system/components';

// Primary (CTA principal)
<Button variant="primary" size="md" onClick={handleSubmit}>
  Enviar
</Button>

// Secondary (ação secundária)
<Button variant="secondary" size="sm">
  Cancelar
</Button>

// Danger (ações destrutivas)
<Button variant="danger" onClick={handleDelete}>
  Deletar
</Button>

// Ghost (mínimo destaque)
<Button variant="ghost">
  Aprender mais
</Button>

// Com loading
<Button isLoading={loading}>
  {loading ? 'Carregando...' : 'Enviar'}
</Button>

// Full width
<Button fullWidth>
  Ação em tela cheia
</Button>
```

### Variantes Visuais

- **primary**: Azul roxo, box-shadow, hover com transform
- **secondary**: Transparente com border, fundo ao hover
- **danger**: Vermelho, perfecto para delete/logout
- **ghost**: Apenas border, minimal

---

## Card

Container versátil para qualquer conteúdo com variantes visuais.

### Props

```typescript
interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'minimal';
  padding?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}
```

### Exemplos

```tsx
import { Card } from '@/design-system/components';

// Default (surface com border)
<Card variant="default" padding="lg">
  Conteúdo normal
</Card>

// Glass (blur effect moderna)
<Card variant="glass" padding="md">
  Conteúdo com destaque
</Card>

// Minimal (apenas border)
<Card variant="minimal" padding="sm">
  Conteúdo discreto
</Card>

// Interactive (hover effect)
<Card variant="default" interactive onClick={handleClick}>
  Clique aqui para mais detalhes
</Card>
```

### Casos de Uso

- `default`: Formulários, listas, conteúdo padrão
- `glass`: Destaques, CTAs importantes, resumos
- `minimal`: Separadores, conteúdo discreto

---

## Input

Input completo com rótulo, validação e ícone.

### Props

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}
```

### Exemplos

```tsx
import { Input } from '@/design-system/components';

// Básico
<Input 
  label="Email" 
  type="email" 
  placeholder="seu@email.com"
/>

// Com ícone
<Input
  label="Buscar"
  icon={<SearchIcon />}
  placeholder="Procure aqui..."
/>

// Com validação
<Input
  label="Senha"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error={password.length < 8 ? 'Mínimo 8 caracteres' : ''}
/>

// Com helper text
<Input
  label="Valor"
  type="number"
  helperText="Em reais (R$)"
/>

// Full width
<Input
  label="Descrição"
  fullWidth
  placeholder="Descreva a transação..."
/>
```

---

## Badge

Tag pequena e colorida para status, categorias, etc.

### Props

```typescript
interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'secondary' | 'default';
  size?: 'sm' | 'md';
  className?: string;
}
```

### Exemplos

```tsx
import { Badge } from '@/design-system/components';

// Variantes
<Badge variant="primary">Em progresso</Badge>
<Badge variant="success">Completo</Badge>
<Badge variant="danger">Erro</Badge>
<Badge variant="warning">Atenção</Badge>
<Badge variant="secondary">Info</Badge>
<Badge variant="default">Default</Badge>

// Tamanhos
<Badge size="sm">Pequena</Badge>
<Badge size="md">Média</Badge>

// Status dentro de card
<Card>
  <h4>Transação</h4>
  <Badge variant="success">Confirmada</Badge>
</Card>
```

---

## Avatar

Imagem ou fallback com iniciais.

### Props

```typescript
interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}
```

### Exemplos

```tsx
import { Avatar } from '@/design-system/components';

// Com imagem
<Avatar 
  src="https://avatars.example.com/user.jpg"
  alt="João Silva"
  size="md"
/>

// Com iniciais (fallback)
<Avatar 
  initials="JS"
  size="lg"
/>

// Tamanhos
<Avatar initials="JD" size="sm" />  {/* 32px */}
<Avatar initials="JD" size="md" />  {/* 40px */}
<Avatar initials="JD" size="lg" />  {/* 56px */}
<Avatar initials="JD" size="xl" />  {/* 80px */}

// Em header de perfil
<div style={{ textAlign: 'center' }}>
  <Avatar src={userImage} initials="JD" size="xl" />
  <h3>João da Silva</h3>
</div>
```

---

## Label

Rótulo para inputs com indicador de obrigatoriedade.

### Props

```typescript
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
}
```

### Exemplos

```tsx
import { Label } from '@/design-system/components';

// Opcional
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />

// Obrigatório
<Label htmlFor="name" required>Nome completo</Label>
<Input id="name" required />

// Com input component
<div>
  <Label required>Seu email</Label>
  <Input type="email" placeholder="seu@email.com" />
</div>
```

---

## Pill

Buttons arredondados para filtros, tags selecionáveis.

### Props

```typescript
interface PillProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'default';
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}
```

### Exemplos

```tsx
import { Pill } from '@/design-system/components';

// Filtro período
<div>
  <Pill isActive={period === 'month'} onClick={() => setPeriod('month')}>
    Mês
  </Pill>
  <Pill isActive={period === 'year'} onClick={() => setPeriod('year')}>
    Ano
  </Pill>
</div>

// Seleção de categoria
{categories.map(cat => (
  <Pill 
    key={cat}
    isActive={selected === cat}
    onClick={() => setSelected(cat)}
    variant="primary"
  >
    {cat}
  </Pill>
))}
```

---

## StatCard

Card para exibição de estatísticas com ícone colorido.

### Props

```typescript
interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'danger';
}
```

### Exemplos

```tsx
import { StatCard } from '@/features/dashboard/components';

// Básico
<StatCard
  label="Total do mês"
  value="R$ 1.250,50"
  color="primary"
/>

// Com ícone
<StatCard
  label="Saldo pessoal"
  value="R$ 5.432,10"
  subtext="Desde o início"
  icon={<PersonIcon />}
  color="secondary"
/>

// Grid de stats
<section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
  <StatCard label="Receitas" value="R$ 3.500" color="success" />
  <StatCard label="Despesas" value="R$ 2.250" color="danger" />
  <StatCard label="Saldo" value="R$ 1.250" color="primary" />
</section>
```

---

## TransactionListItem

Item individual de uma transação em lista.

### Props

```typescript
interface TransactionListItemProps {
  name: string;
  category: string;
  value: number;
  date: string;
  type: 'income' | 'expense';
  categoryColor?: string;
}
```

### Exemplos

```tsx
import { TransactionListItem } from '@/features/dashboard/components';

// Despesa
<TransactionListItem
  name="Supermercado"
  category="Alimentação"
  value={125.50}
  date="Hoje"
  type="expense"
  categoryColor="#FF6B6B"
/>

// Receita
<TransactionListItem
  name="Salário"
  category="Renda"
  value={3500}
  date="Ontem"
  type="income"
  categoryColor="#00D084"
/>

// Em lista completa
<Card variant="default" padding="sm">
  <div>
    {transactions.map((tx, idx) => (
      <TransactionListItem
        key={idx}
        name={tx.name}
        category={tx.category}
        value={tx.value}
        date={tx.date}
        type={tx.type}
        categoryColor={tx.categoryColor}
      />
    ))}
  </div>
</Card>
```

---

## CategoryBreakdown

Grid de categorias com visualização de gastos e percentuais.

### Props

```typescript
interface Category {
  name: string;
  value: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
}

interface CategoryBreakdownProps {
  categories: Category[];
  total: number;
}
```

### Exemplos

```tsx
import { CategoryBreakdown } from '@/features/personal/components';

const categories = [
  {
    name: 'Alimentação',
    value: 450,
    percentage: 36,
    color: '#FF6B6B',
    icon: '🍕',
  },
  {
    name: 'Transporte',
    value: 280,
    percentage: 22,
    color: '#FFB84D',
    icon: '🚗',
  },
  // ... mais categorias
];

<CategoryBreakdown categories={categories} total={1250} />
```

---

## Integração de Componentes

Exemplo de uma seção completa usando múltiplos componentes:

```tsx
import { Button, Card, Input, Badge } from '@/design-system/components';
import { StatCard } from '@/features/dashboard/components';

export function CompleteExample() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('active');

  return (
    <section>
      <Card variant="glass" padding="lg">
        <h2>Criar Gasto Compartilhado</h2>
        
        <div style={{ marginBottom: '16px' }}>
          <Input
            label="Descrição"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="O que foi gasto?"
            fullWidth
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Label required>Status</Label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Pill
              isActive={status === 'pending'}
              onClick={() => setStatus('pending')}
            >
              Pendente
            </Pill>
            <Pill
              isActive={status === 'approved'}
              onClick={() => setStatus('approved')}
            >
              Aprovado
            </Pill>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="primary" fullWidth>Salvar</Button>
          <Button variant="secondary" fullWidth>Cancelar</Button>
        </div>
      </Card>

      <StatCard
        label="Transações este mês"
        value="12"
        color="primary"
        icon={<InvoiceIcon />}
      />
    </section>
  );
}
```

---

## Dicas de Performance

1. **Lazy import**: Importe apenas componentes que usa
2. **Memoization**: Use `React.memo()` para componentes que recebem muitas props
3. **CSS**: Reutilize variáveis CSS em vez de hardcoding valores
4. **Eventos**: Debounce em `onChange` de inputs

## Dicas de Acessibilidade

1. **Labels**: Sempre use `Label` vinculado ao `Input`
2. **ARIA**: Adicione roles quando necessário
3. **Contraste**: Mantenha padrão WCAG AA
4. **Teclado**: Teste navegação com Tab

---

Para mais exemplos, veja os componentes em `src/features/*/`.
