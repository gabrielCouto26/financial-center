# Financial Center - Frontend

Frontend completo para gerenciamento de finanças pessoais, compartilhadas e em grupo.

## Stack Tecnológico

- **React 19**: Framework UI
- **TypeScript**: Type safety
- **Vite**: Build tool e dev server
- **Vanilla CSS**: Tokens centralizados (sem Tailwind)
- **ESLint**: Code quality

## Estrutura do Projeto

```
apps/frontend/
├── src/
│   ├── design-system/
│   │   ├── tokens.json          # Tokens centralizados
│   │   ├── tokens.css           # Gerado automaticamente
│   │   ├── index.css            # CSS global com reset
│   │   └── components/          # Componentes atômicos
│   │       ├── Button.tsx|css
│   │       ├── Card.tsx|css
│   │       ├── Input.tsx|css
│   │       ├── Badge.tsx|css
│   │       ├── Avatar.tsx|css
│   │       ├── Label.tsx|css
│   │       ├── Pill.tsx|css
│   │       └── index.ts
│   │
│   ├── layout/
│   │   ├── DashboardLayout.tsx|css
│   │   ├── Header.tsx|css
│   │   └── Sidebar.tsx|css
│   │
│   ├── features/
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx|css
│   │   │   └── components/
│   │   │       ├── StatCard.tsx|css
│   │   │       ├── TransactionListItem.tsx|css
│   │   │       └── WelcomeCard.tsx|css
│   │   │
│   │   ├── personal/
│   │   │   ├── PersonalPage.tsx|css
│   │   │   └── components/
│   │   │       ├── PeriodSelector.tsx|css
│   │   │       └── CategoryBreakdown.tsx|css
│   │   │
│   │   ├── couple/
│   │   │   ├── CouplePage.tsx|css
│   │   │   └── components/ (reutilizados)
│   │   │
│   │   └── transactions/
│   │       ├── TransactionsPage.tsx|css
│   │       └── components/ (reutilizados)
│   │
│   ├── services/
│   │   └── api.ts               # Wrapper de requisições HTTP
│   │
│   ├── types/
│   │   ├── user.ts
│   │   ├── transaction.ts
│   │   ├── couple.ts
│   │   ├── group.ts
│   │   └── dashboard.ts
│   │
│   ├── App.tsx                  # Roteamento principal
│   ├── main.tsx                 # Entrada React
│   └── index.css                # Importações e reset CSS
│
├── index.html                   # HTML entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
└── DESIGN_SYSTEM.md             # Documentação de design
```

## Começando

### Instalação

```bash
npm install
```

### Dev Server

```bash
npm run dev
```

Abre em `http://localhost:5173` com HMR habilitado.

### Build

```bash
npm run build
```

Cria bundle otimizado em `dist/`.

### Tipagem

```bash
npm run typecheck
```

Verifica tipos sem emitir arquivos.

### Linting

```bash
npm run lint
```

Fixa problemas de ESLint automaticamente.

### Gerar CSS dos Tokens

```bash
npm run tokens:build
```

Converte `tokens.json` em `tokens.css`.

## Páginas Disponíveis

### Dashboard (`/`)

Visão geral de todas as finanças com resumos agregados e últimas transações.

**Componentes:**
- WelcomeCard com CTAs
- 4 cards de resumo (total mês, pessoal, casal, grupos)
- Lista das últimas 5-10 transações

### Personal (`/personal`)

Análise detalhada das finanças pessoais com período selecionável.

**Componentes:**
- Seletor de período (mês/trimestre/ano)
- Resumo com variação em relação ao mês anterior
- Grid de categorias com percentuais
- Lista completa com filtros

### Couple (`/couple`)

Gerenciamento de despesas compartilhadas com balanço bilateral.

**Componentes:**
- Hero card com saldo total
- Balanço individual (você vs. parceiro)
- Card de acertos
- Breakdown por categoria
- Perfil do parceiro
- Lista de despesas compartilhadas

### Transactions (`/transactions`)

View avançada de todas as transações com filtros e 2 modos de visualização.

**Componentes:**
- Filtros: busca, tipo, direção, categoria
- Estatísticas em tempo real
- View lista (agrupado por data)
- View timeline (visual de linha do tempo)
- FAB para nova transação

## Design System

O projeto usa um **design system completo** com:

- **Tokens centralizados**: Cores, tipografia, espaçamento, sombras
- **Componentes reutilizáveis**: Button, Card, Input, Badge, Avatar, Label, Pill
- **Variáveis CSS**: Sem dependência de Tailwind ou pré-processadores
- **Temas**: Dark-first design, pronto para dark mode
- **Responsividade**: Mobile-first approach

Veja [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) para documentação completa.

## Componentes Principais

### Atômicos (Design System)

- `Button`: CTA com variantes e loading states
- `Card`: Container com variantes (default/glass/minimal)
- `Input`: Com label, error, helper, ícone
- `Badge`: Tags com cores por tipo
- `Avatar`: Imagem ou initials
- `Label`: Com indicador de obrigatoriedade
- `Pill`: Buttons arredondados para filtros

### De Funcionalidade

- `StatCard`: Card com estatística + ícone
- `TransactionListItem`: Item individual
- `CategoryBreakdown`: Grid de categorias
- `WelcomeCard`: Card de boas-vindas
- `PeriodSelector`: Seletor de período
- E mais...

## Padrões

### Nomeação

- Componentes: PascalCase (e.g., `DashboardPage.tsx`)
- Funções/variáveis: camelCase
- CSS classes: BEM (e.g., `.dashboard-page__header`)
- Variáveis CSS: kebab-case (e.g., `--color-primary`)

### Estrutura de Arquivos

Cada feature tem:
- `[Feature]Page.tsx` + `[Feature]Page.css`
- `components/` com sub-componentes
- Cada componente: `.tsx` + `.css`

### Estilos

- Sem Tailwind, apenas CSS vanilla
- Variáveis CSS para todos os valores
- BEM para namespacing
- Mobile-first media queries

## Integração com Backend

Todas as chamadas HTTP usam o wrapper `apiFetch` em `services/api.ts`.

```tsx
import { apiFetch } from '@/services/api';

// GET
const data = await apiFetch('/endpoint');

// POST
await apiFetch('/endpoint', { method: 'POST', body: { ...} });
```

## Performance

- **Code splitting**: Páginas lazy-loaded
- **CSS otimizado**: Variáveis reutilizadas
- **No JS frameworks desnecessários**: Apenas React
- **Animações GPU-accelerated**: Transform, opacity
- **Images otimizadas**: Placeholders responsivos

## Acessibilidade

- Semântica HTML correta
- Roles e aria-labels
- Contraste WCAG AA
- Ordem de tab lógica
- Labels vinculadas a inputs

## Troubleshooting

### Tipos não encontrados

Rode `npm run typecheck` para verificar erros.

### CSS não atualiza

Rode `npm run tokens:build` se modificou `tokens.json`.

### Port já em uso

Altere em `vite.config.ts` ou rode em outra porta:
```bash
npm run dev -- --port 3000
```

## Próximas Etapas

- [ ] Integrar com API real
- [ ] Adicionar autenticação
- [ ] Formulários para criar/editar transações
- [ ] Modais e confirmações
- [ ] Notificações/toasts
- [ ] Testes unitários e E2E
- [ ] Performance optimizations
- [ ] PWA features

## Contribuindo

1. Crie um branch: `git checkout -b feature/sua-feature`
2. Siga os padrões de nomeação e estrutura
3. Rode `npm run lint` antes de commitar
4. Adicione testes se aplicável
5. Faça PR

## Licença

Proprietary - Financial Center

## Contato

Para dúvidas ou sugestões, abra uma issue no repositório.
