import { useState } from 'react';
import { Card, Button, Badge, Avatar } from '../../design-system/components';
import { TransactionListItem } from '../dashboard/components/TransactionListItem';
import './CouplePage.css';

const BalanceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
  </svg>
);

export const CouplePage = () => {
  const [isLinked, setIsLinked] = useState(true);
  const [partnerEmail, setPartnerEmail] = useState('');

  // Mock data
  const coupleData = {
    totalBalance: 5420.5,
    youPaid: 3200,
    yourPart: 2710.25,
    partnerPaid: 2220.5,
    partnerPart: 2710.25,
    whoOwes: 'partner', // 'you' | 'partner'
    owesAmount: 489.75,
  };

  const partner = {
    name: 'Maria Silva',
    email: 'maria@example.com',
    avatar: 'https://via.placeholder.com/64',
    initials: 'MS',
  };

  const sharedTransactions = [
    { name: 'Aluguel', category: 'Moradia', value: 1500, date: '1º mês', type: 'expense' as const, categoryColor: '#FF6B6B' },
    { name: 'Internet/TV', category: 'Utilidades', value: 150, date: '5º mês', type: 'expense' as const, categoryColor: '#FFB84D' },
    { name: 'Restaurante', category: 'Alimentação', value: 280, date: '10º mês', type: 'expense' as const, categoryColor: '#00D4FF' },
    { name: 'Cinema', category: 'Lazer', value: 90, date: '15º mês', type: 'expense' as const, categoryColor: '#6B5FFF' },
  ];

  const categories = [
    { name: 'Alimentação', youValue: 200, partnerValue: 250, color: '#FF6B6B' },
    { name: 'Moradia', youValue: 1500, partnerValue: 1500, color: '#FFB84D' },
    { name: 'Utilidades', youValue: 150, partnerValue: 150, color: '#00D4FF' },
    { name: 'Lazer', youValue: 150, partnerValue: 120, color: '#6B5FFF' },
  ];

  if (!isLinked) {
    return (
      <div className="couple-page">
        <div className="couple-page__header">
          <h1>Gastos Compartilhados</h1>
          <p>Sincronize com seu parceiro para gerenciar despesas conjuntas</p>
        </div>

        <Card variant="glass" padding="lg" className="couple-page__link-card">
          <div className="couple-page__link-content">
            <div className="couple-page__link-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
              </svg>
            </div>
            <h3>Vincular Parceiro</h3>
            <p>Insira o email do seu parceiro para começar a compartilhar despesas</p>
            <div className="couple-page__link-form">
              <input
                type="email"
                placeholder="email@example.com"
                value={partnerEmail}
                onChange={(e) => setPartnerEmail(e.target.value)}
                className="couple-page__input"
              />
              <Button variant="primary" onClick={() => setIsLinked(true)}>
                Vincular
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="couple-page">
      <div className="couple-page__header">
        <h1>Gastos Compartilhados</h1>
        <p>Você e {partner.name} estão sincronizados</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="couple-page__grid">
        {/* Hero Card - Total Balance */}
        <Card variant="glass" padding="lg" className="couple-page__hero">
          <div className="couple-page__hero-content">
            <div>
              <p className="couple-page__hero-label">Saldo Total Compartilhado</p>
              <p className="couple-page__hero-value">R$ {coupleData.totalBalance.toFixed(2)}</p>
              <p className="couple-page__hero-status">
                <Badge variant="success">Sincronizado</Badge>
              </p>
            </div>
            <div className="couple-page__hero-icon">
              <BalanceIcon />
            </div>
          </div>
        </Card>

        {/* Balance Card - You */}
        <Card variant="default" padding="md" className="couple-page__balance-card">
          <h4>Você</h4>
          <div className="balance-card__content">
            <div className="balance-card__stat">
              <p className="balance-card__label">Você pagou</p>
              <p className="balance-card__value">R$ {coupleData.youPaid.toFixed(2)}</p>
            </div>
            <div className="balance-card__stat">
              <p className="balance-card__label">Sua parte</p>
              <p className="balance-card__value">R$ {coupleData.yourPart.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        {/* Balance Card - Partner */}
        <Card variant="default" padding="md" className="couple-page__balance-card">
          <h4>{partner.name.split(' ')[0]}</h4>
          <div className="balance-card__content">
            <div className="balance-card__stat">
              <p className="balance-card__label">Ele/a pagou</p>
              <p className="balance-card__value">R$ {coupleData.partnerPaid.toFixed(2)}</p>
            </div>
            <div className="balance-card__stat">
              <p className="balance-card__label">Sua parte</p>
              <p className="balance-card__value">R$ {coupleData.partnerPart.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        {/* Settlement Card */}
        <Card variant="default" padding="md" className="couple-page__settlement">
          <h4>Acertando as contas</h4>
          {coupleData.whoOwes === 'you' ? (
            <div className="settlement-content">
              <p className="settlement-message">Você deve R$ {coupleData.owesAmount.toFixed(2)}</p>
              <Button variant="primary" fullWidth>
                Pagar Agora
              </Button>
            </div>
          ) : (
            <div className="settlement-content">
              <p className="settlement-message settlement-message--positive">
                {partner.name} deve você R$ {coupleData.owesAmount.toFixed(2)}
              </p>
              <Button variant="secondary" fullWidth>
                Cobrar
              </Button>
            </div>
          )}
        </Card>

        {/* Category Breakdown */}
        <Card variant="default" padding="md" className="couple-page__categories">
          <h4>Despesas por Categoria</h4>
          <div className="categories-list">
            {categories.map((cat) => (
              <div key={cat.name} className="category-row">
                <div className="category-label">
                  <div
                    className="category-color"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                </div>
                <div className="category-values">
                  <span className="category-value">Você: R$ {cat.youValue}</span>
                  <span className="category-value">Ele/a: R$ {cat.partnerValue}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Partner Profile */}
        <Card variant="default" padding="md" className="couple-page__partner">
          <div className="partner-card__content">
            <Avatar src={partner.avatar} initials={partner.initials} size="lg" />
            <h4 style={{ marginTop: 'var(--space-md)' }}>{partner.name}</h4>
            <p className="partner-card__email">{partner.email}</p>
            <p className="partner-card__balance">
              Saldo: <strong>R$ {coupleData.totalBalance / 2}</strong>
            </p>
            <Button variant="danger" fullWidth style={{ marginTop: 'var(--space-md)' }}>
              Desvincular
            </Button>
          </div>
        </Card>
      </div>

      {/* Shared Transactions */}
      <section className="couple-page__transactions">
        <h3>Despesas Compartilhadas</h3>
        <Card variant="default" padding="sm">
          <div className="couple-page__transaction-list">
            {sharedTransactions.map((tx, idx) => (
              <TransactionListItem key={idx} {...tx} />
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};
