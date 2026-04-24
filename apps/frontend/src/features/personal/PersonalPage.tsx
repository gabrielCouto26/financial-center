import { useState } from 'react';
import { Card } from '../../design-system/components';
import { PeriodSelector } from './components/PeriodSelector';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { TransactionListItem } from '../dashboard/components/TransactionListItem';
import './PersonalPage.css';

const TrendUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TrendDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

export const PersonalPage = () => {
  const [period, setPeriod] = useState('Mês');

  // Mock data
  const stats = {
    thisMonth: 1250.5,
    lastMonth: 1580.25,
    accumulated: 15430.2,
  };

  const variation = ((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100;
  const isPositive = variation > 0;

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
    {
      name: 'Lazer',
      value: 320,
      percentage: 26,
      color: '#00D4FF',
      icon: '🎬',
    },
    {
      name: 'Assinatura',
      value: 200,
      percentage: 16,
      color: '#6B5FFF',
      icon: '📺',
    },
  ];

  const transactions = [
    { name: 'Supermercado', category: 'Alimentação', value: 125.5, date: 'Hoje', type: 'expense' as const, categoryColor: '#FF6B6B' },
    { name: 'Carro', category: 'Transporte', value: 50, date: 'Ontem', type: 'expense' as const, categoryColor: '#FFB84D' },
    { name: 'Cinema', category: 'Lazer', value: 80, date: '2 dias atrás', type: 'expense' as const, categoryColor: '#00D4FF' },
    { name: 'Netflix', category: 'Assinatura', value: 25, date: '3 dias atrás', type: 'expense' as const, categoryColor: '#6B5FFF' },
    { name: 'Restaurante', category: 'Alimentação', value: 150, date: '5 dias atrás', type: 'expense' as const, categoryColor: '#FF6B6B' },
  ];

  return (
    <div className="personal-page">
      <div className="personal-page__header">
        <div>
          <h1>Meus Gastos</h1>
          <p>Acompanhe suas despesas pessoais e saiba onde seu dinheiro está indo</p>
        </div>
      </div>

      <PeriodSelector currentPeriod={period} onPeriodChange={setPeriod} />

      {/* Summary Stats */}
      <section className="personal-page__summary">
        <Card variant="glass" padding="lg" className="summary-card">
          <div className="summary-card__content">
            <div className="summary-card__item">
              <p className="summary-card__label">Este mês</p>
              <p className="summary-card__value">R$ {stats.thisMonth.toFixed(2)}</p>
            </div>
            <div className="summary-card__divider" />
            <div className="summary-card__item">
              <p className="summary-card__label">Mês anterior</p>
              <p className="summary-card__value">R$ {stats.lastMonth.toFixed(2)}</p>
            </div>
            <div className="summary-card__divider" />
            <div className="summary-card__item">
              <p className="summary-card__label">Variação</p>
              <p className={`summary-card__value summary-card__value--${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? <TrendUpIcon /> : <TrendDownIcon />}
                {Math.abs(variation).toFixed(1)}%
              </p>
            </div>
            <div className="summary-card__divider" />
            <div className="summary-card__item">
              <p className="summary-card__label">Acumulado</p>
              <p className="summary-card__value">R$ {stats.accumulated.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Categories Breakdown */}
      <CategoryBreakdown categories={categories} total={stats.thisMonth} />

      {/* Transactions List */}
      <section className="personal-page__transactions">
        <div className="personal-page__section-header">
          <h3>Minhas Transações</h3>
          <div className="personal-page__filters">
            <select className="personal-page__select">
              <option>Todas as categorias</option>
              <option>Alimentação</option>
              <option>Transporte</option>
              <option>Lazer</option>
            </select>
          </div>
        </div>

        <Card variant="default" padding="sm">
          <div className="personal-page__transaction-list">
            {transactions.map((tx, idx) => (
              <TransactionListItem key={idx} {...tx} />
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};
