import { useState } from 'react';
import { Card, Button, Badge, Input } from '../../design-system/components';
import { TransactionListItem } from '../dashboard/components/TransactionListItem';
import './TransactionsPage.css';

const ListIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="18" height="4" rx="1" />
    <rect x="3" y="9" width="18" height="4" rx="1" />
    <rect x="3" y="15" width="18" height="4" rx="1" />
  </svg>
);

const TimelineIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="2" x2="12" y2="22" />
    <circle cx="12" cy="4" r="3" />
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="20" r="3" />
  </svg>
);

interface Transaction {
  id: string;
  name: string;
  category: string;
  value: number;
  date: string;
  type: 'income' | 'expense';
  categoryColor: string;
  transactionType: 'personal' | 'couple' | 'group';
}

export const TransactionsPage = () => {
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');
  const [transactionType, setTransactionType] = useState('all');
  const [direction, setDirection] = useState('all');
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const mockTransactions: Transaction[] = [
    { id: '1', name: 'Supermercado', category: 'Alimentação', value: 125.5, date: '2024-04-23', type: 'expense', categoryColor: '#FF6B6B', transactionType: 'personal' },
    { id: '2', name: 'Aluguel', category: 'Moradia', value: 1500, date: '2024-04-22', type: 'expense', categoryColor: '#FFB84D', transactionType: 'couple' },
    { id: '3', name: 'Salário', category: 'Renda', value: 3500, date: '2024-04-20', type: 'income', categoryColor: '#00D084', transactionType: 'personal' },
    { id: '4', name: 'Cinema', category: 'Lazer', value: 80, date: '2024-04-18', type: 'expense', categoryColor: '#00D4FF', transactionType: 'couple' },
    { id: '5', name: 'Uber', category: 'Transporte', value: 42.5, date: '2024-04-15', type: 'expense', categoryColor: '#6B5FFF', transactionType: 'personal' },
    { id: '6', name: 'Restaurante Grupo', category: 'Alimentação', value: 280, date: '2024-04-10', type: 'expense', categoryColor: '#FF6B6B', transactionType: 'group' },
  ];

  // Filter transactions
  const filteredTransactions = mockTransactions.filter((tx) => {
    if (transactionType !== 'all' && tx.transactionType !== transactionType) return false;
    if (direction !== 'all' && ((direction === 'income' && tx.type !== 'income') || (direction === 'expense' && tx.type !== 'expense'))) return false;
    if (category !== 'all' && tx.category !== category) return false;
    if (searchTerm && !tx.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Stats
  const totalFiltered = filteredTransactions.reduce((sum, tx) => sum + (tx.type === 'income' ? tx.value : -tx.value), 0);
  const expenseTotal = filteredTransactions.filter((tx) => tx.type === 'expense').reduce((sum, tx) => sum + tx.value, 0);
  const incomeTotal = filteredTransactions.filter((tx) => tx.type === 'income').reduce((sum, tx) => sum + tx.value, 0);

  // Group by date
  const groupedByDate: { [key: string]: Transaction[] } = {};
  filteredTransactions.forEach((tx) => {
    const dateKey = new Date(tx.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
    groupedByDate[dateKey].push(tx);
  });

  return (
    <div className="transactions-page">
      <div className="transactions-page__header">
        <h1>Transações</h1>
        <p>Acompanhe todas as suas movimentações financeiras em um único lugar</p>
      </div>

      {/* Filters Section */}
      <Card variant="default" padding="lg" className="transactions-page__filters">
        <div className="filters-grid">
          {/* Search */}
          <Input
            label="Buscar transação"
            placeholder="Nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />

          {/* Type Filter */}
          <div className="filter-group">
            <label className="filter-label">Tipo</label>
            <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)} className="filter-select">
              <option value="all">Todos os tipos</option>
              <option value="personal">Personal</option>
              <option value="couple">Couple</option>
              <option value="group">Group</option>
            </select>
          </div>

          {/* Direction Filter */}
          <div className="filter-group">
            <label className="filter-label">Direção</label>
            <select value={direction} onChange={(e) => setDirection(e.target.value)} className="filter-select">
              <option value="all">Todas</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">Categoria</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="filter-select">
              <option value="all">Todas as categorias</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Transporte">Transporte</option>
              <option value="Lazer">Lazer</option>
              <option value="Moradia">Moradia</option>
              <option value="Renda">Renda</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="transactions-page__view-mode">
          <button
            className={`view-mode-btn ${viewMode === 'list' ? 'view-mode-btn--active' : ''}`}
            onClick={() => setViewMode('list')}
            title="Lista"
          >
            <ListIcon />
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'timeline' ? 'view-mode-btn--active' : ''}`}
            onClick={() => setViewMode('timeline')}
            title="Timeline"
          >
            <TimelineIcon />
          </button>
        </div>
      </Card>

      {/* Statistics */}
      <section className="transactions-page__stats">
        <div className="stat-item stat-item--info">
          <p className="stat-label">Transações filtradas</p>
          <p className="stat-value">{filteredTransactions.length}</p>
        </div>
        <div className="stat-item stat-item--income">
          <p className="stat-label">Receitas</p>
          <p className="stat-value">R$ {incomeTotal.toFixed(2)}</p>
        </div>
        <div className="stat-item stat-item--expense">
          <p className="stat-label">Despesas</p>
          <p className="stat-value">R$ {expenseTotal.toFixed(2)}</p>
        </div>
        <div className="stat-item stat-item--total">
          <p className="stat-label">Saldo líquido</p>
          <p className={`stat-value ${totalFiltered >= 0 ? 'stat-value--positive' : 'stat-value--negative'}`}>
            R$ {totalFiltered.toFixed(2)}
          </p>
        </div>
      </section>

      {/* Transactions List/Timeline */}
      {viewMode === 'list' ? (
        <Card variant="default" padding="sm">
          <div className="transactions-page__list">
            {Object.entries(groupedByDate).map(([date, transactions]) => (
              <div key={date}>
                <h4 className="transactions-page__date-header">{date}</h4>
                {transactions.map((tx) => (
                  <TransactionListItem
                    key={tx.id}
                    name={tx.name}
                    category={tx.category}
                    value={tx.value}
                    date={tx.date}
                    type={tx.type}
                    categoryColor={tx.categoryColor}
                  />
                ))}
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card variant="default" padding="lg" className="transactions-page__timeline">
          <div className="timeline">
            {Object.entries(groupedByDate).map(([date, transactions]) => (
              <div key={date} className="timeline__group">
                <div className="timeline__date">
                  <Badge variant="secondary">{date}</Badge>
                </div>
                <div className="timeline__items">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="timeline__item">
                      <div className="timeline__dot" />
                      <div className="timeline__content">
                        <p className="timeline__name">{tx.name}</p>
                        <p className="timeline__category">{tx.category}</p>
                      </div>
                      <div className={`timeline__value timeline__value--${tx.type}`}>
                        {tx.type === 'income' ? '+' : '-'} R$ {tx.value.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* CTA Flutuante */}
      <div className="transactions-page__fab">
        <Button variant="primary" onClick={() => console.log('Add transaction')}>
          + Nova Transação
        </Button>
      </div>
    </div>
  );
};
