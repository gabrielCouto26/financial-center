# PRD — Centro Financeiro Social

## 1. Visão do Produto

Aplicação web simples para gerenciamento financeiro com foco em:
- **Despesas pessoais (core)**
- **Despesas de casal (prioridade secundária, mas forte)**
- **Despesas em grupo (feature complementar estilo Splitwise)**

O produto deve permitir que o usuário entenda rapidamente:
1. Quanto gastou
2. Quanto tem de saldo
3. Quanto deve / quanto devem a ele

Sem complexidade desnecessária.

---

## 2. Objetivo do MVP

Criar uma POC funcional que valide:
- Entrada rápida de despesas
- Visualização clara de saldo e obrigações
- Uso recorrente para controle pessoal e de casal

---

## 3. Público-Alvo

- Pessoas que não usam planilhas
- Casais que dividem contas
- Usuários que participam ocasionalmente de despesas em grupo

---

## 4. Proposta de Valor

"Veja sua vida financeira (pessoal + casal) em segundos, sem planilha, e resolva gastos compartilhados sem fricção."

---

## 5. Estrutura do Produto

### 5.1 Navegação (Sidebar)

- **Dashboard (home)**
- **Pessoal**
- **Casal**
- **Grupos**

---

## 6. Funcionalidades do MVP

### 6.1 Transações

Campos obrigatórios:
- nome
- valor
- categoria
- data
- quem pagou

Campos condicionais:
- participantes
- tipo de divisão (igual / percentual)

Tipos de transação:
- pessoal
- casal
- grupo

---

### 6.2 Categorias

Categorias simples (fixas inicialmente):
- Moradia
- Alimentação
- Transporte
- Lazer
- Outros

---

### 6.3 Modo Casal

- Dois usuários vinculados
- Todas as despesas podem ser:
  - pagas por um
  - divididas entre os dois

Suporte a divisão:
- 50/50 (default)
- percentual customizado

---

### 6.4 Modo Grupo

- Criar grupo
- Adicionar participantes
- Registrar despesas
- Divisão:
  - igual
  - percentual

- Cálculo automático de:
  - quem deve quem

Menor prioridade visual na interface.

---

### 6.5 Dashboard (Core do Produto)

A dashboard deve priorizar **pessoal e casal**.

#### Seções principais:

1. **Resumo Financeiro (destaque)**
   - Total gasto no mês
   - Saldo atual

2. **Casal (destaque médio)**
   - Quanto você deve
   - Quanto devem para você

3. **Grupos (baixo destaque)**
   - Saldo agregado de grupos

4. **Lista recente de transações**

---

## 7. UX (Fluxo Principal)

1. Usuário entra no app
2. Visualiza dashboard
3. Clica em "+ despesa"
4. Seleciona tipo:
   - pessoal
   - casal
   - grupo
5. Preenche dados mínimos
6. Sistema calcula automaticamente
7. Dashboard atualiza

Tempo alvo:
- adicionar despesa: < 10 segundos
- entender saldo: < 5 segundos

---

## 8. Regras de Negócio

### 8.1 Divisão de despesas

- Igual:
  - valor / número de participantes

- Percentual:
  - cada participante define %
  - soma deve ser 100%

---

### 8.2 Cálculo de saldo

Para cada usuário:

- saldo = (pagou) - (sua parte)

---

### 8.3 Casal

- tratado como grupo fixo de 2 pessoas
- aparece com prioridade maior na UI

---

## 9. Modelo de Dados (simplificado)

```ts
type Transaction = {
  id: string
  name: string
  amount: number
  category: string
  type: 'personal' | 'couple' | 'group'
  paidBy: string
  participants?: string[]
  splits?: {
    userId: string
    percentage: number
  }[]
  date: Date
  groupId?: string
}
```

---

## 10. Fora do Escopo (MVP)

- Integração com bancos
- Importação automática de gastos
- Metas financeiras
- Relatórios avançados
- Multi-moeda
- Notificações

---

## 11. Métricas de Sucesso

- Tempo médio de criação de despesa
- Retenção semanal
- Número de transações por usuário
- Uso de modo casal

---

## 12. Roadmap Pós-MVP

1. Divisão avançada (valores fixos + percentual misto)
2. Otimização de pagamentos (tipo Splitwise)
3. Notificações de cobrança
4. Filtros e histórico
5. Monetização (ads ou premium)

---

## 13. Diferencial do Produto

- Foco em vida real: pessoal + casal
- Grupos como complemento, não como core
- Interface direta e rápida
- Clareza imediata de saldo

---

## 14. Princípios do Produto

- Simplicidade > Completude
- Velocidade > Precisão extrema
- Clareza > Features
- Uso recorrente > Feature rica

