# Paleta de Cores - Financial Center Frontend

## Visão Geral

O frontend agora utiliza uma paleta de cores **suave e moderna**, com azul como cor primária e branco claro como fundo. O design segue uma abordagem clean e profissional, ideal para uma aplicação financeira.

## Cores Primárias

### Azul Primário
- **Principal**: `#4A90E2`
- **Escuro**: `#2E5C8A`
- **Claro**: `#6BA3EF`

Utilizada em botões de ação, links, headers e elementos de destaque.

### Branco e Neutros
- **Fundo**: `#F8FAFC` - Fundo principal da aplicação
- **Fundo Secundário**: `#F0F4F8` - Fundo para áreas secundárias
- **Superfície**: `#FFFFFF` - Cartões e painéis
- **Superfície Hover**: `#F5F8FB` - Estado hover
- **Superfície Claro**: `#E8EEF5` - Áreas desativadas

### Texto
- **Primário**: `#1A1F36` - Texto principal
- **Secundário**: `#4A5568` - Texto secundário
- **Terciário**: `#718096` - Texto suave (labels, hints)

### Bordas
- **Principal**: `#D0D8E0` - Bordas normais
- **Claro**: `#E8EEF5` - Bordas sutis

## Cores de Status

### Sucesso
- **Principal**: `#4CAF50`
- **Escuro**: `#388E3C`
- **Claro**: `#81C784`

Utilizada em transações com saldo positivo, confirmações e status ativo.

### Perigo
- **Principal**: `#E57373`
- **Escuro**: `#C62828`
- **Claro**: `#EF9A9A`

Utilizada em transações negativas, erros e ações destrutivas.

### Aviso
- **Principal**: `#FFA726`
- **Escuro**: `#E65100`
- **Claro**: `#FFCC80`

Utilizada em pendências, avisos e ações que requerem atenção.

### Secundário
- **Principal**: `#5CA8D9`
- **Escuro**: `#3E7BA5`
- **Claro**: `#7FB3E6`

Utilizada como complementar ao azul primário.

## Sombras

As sombras foram ajustadas para o tema claro:

```css
--shadow-sm: 0 1px 2px rgba(26, 31, 54, 0.04);
--shadow-md: 0 4px 6px rgba(26, 31, 54, 0.08);
--shadow-lg: 0 10px 15px rgba(26, 31, 54, 0.1);
--shadow-xl: 0 20px 25px rgba(26, 31, 54, 0.12);
--shadow-2xl: 0 25px 50px rgba(26, 31, 54, 0.15);
--shadow-glass: 0 8px 32px rgba(74, 144, 226, 0.08);
```

## Gradientes

Os gradientes foram suavizados para combinar com o tema claro:

- **Welcome Card**: `linear-gradient(135deg, rgba(74, 144, 226, 0.08), rgba(92, 168, 217, 0.08))`
- **Dashboard Background**: Radial gradients sutis com opacidade mínima
- **Stat Items**: Gradientes com opacidade reduzida para melhor legibilidade

## Componentes Coloridos

### Badges
- **Primary**: Fundo azul claro com texto azul escuro
- **Success**: Fundo verde claro com texto verde escuro
- **Danger**: Fundo vermelho claro com texto vermelho escuro
- **Warning**: Fundo laranja claro com texto laranja escuro
- **Secondary**: Fundo ciano claro com texto ciano escuro

### Pills
Botões e tags com bordas da cor principal e fundo transparente. Quando ativo, fundo sólido com texto branco.

### Buttons
- **Primary**: Azul sólido com texto branco, hover com azul mais claro
- **Secondary**: Fundo claro com borda e hover azulado
- **Danger**: Vermelho sólido com texto branco
- **Ghost**: Transparente com borda, hover com fundo claro

## Acessibilidade

A paleta de cores foi selecionada para garantir:

- ✅ Contraste adequado (WCAG AA) entre texto e fundo
- ✅ Distinção clara entre estados (hover, active, disabled)
- ✅ Cores não dependem apenas de tom para distinção
- ✅ Aplicável em modo claro padrão

## Uso em Código

Todas as cores estão definidas como variáveis CSS em `tokens.css`:

```css
/* Cor primária */
background-color: var(--color-primary);

/* Cor de sucesso */
color: var(--color-success);

/* Sombra */
box-shadow: var(--shadow-lg);
```

**Nunca use cores hardcoded.** Sempre utilize as variáveis de tokens para manter a consistência.

## Arquivos Relevantes

- `tokens.json` - Definição de cores em JSON
- `design-system/tokens.css` - Variáveis CSS geradas automaticamente
- `index.css` - Estilos globais com cores aplicadas
- `COLOR_PALETTE.md` - Este arquivo

## Atualizações Futuras

Para atualizar a paleta de cores:

1. Edite `tokens.json`
2. Execute: `node scripts/generate-css-tokens.mjs`
3. As variáveis CSS serão geradas automaticamente
4. Todos os componentes serão atualizados automaticamente
