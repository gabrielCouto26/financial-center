import { Card } from '../../design-system/components';
import { WelcomeCard } from './components/WelcomeCard';
import { StatCard } from './components/StatCard';
import { TransactionListItem } from './components/TransactionListItem';
import './DashboardPage.css';

// Ícones SVG simples
const BalanceIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
  </svg>
);

const PersonalIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
  </svg>
);

const CoupleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const GroupIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M16 3.13a4 4 0 0 1 0 7.75M23 21v-2a4 4 0 0 0-3-3.87M16 11a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM9 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
  </svg>
);

export const DashboardPage = () => {
  // TODO: Substituir dados mock pelos dados reais da API

  const mockStats = {
    totalMonth: 1250.5,
    personalBalance: 5432.1,
    coupleBalance: 2180.75,
    groupBalance: 450.0,
  };

  const mockTransactions: Array<{ name: string; category: string; value: number; date: string; type: 'expense' | 'income'; color: string }> = [
    { name: 'Supermercado', category: 'Alimentação', value: 125.5, date: 'Hoje', type: 'expense', color: '#FF6B6B' },
    { name: 'Salário', category: 'Renda', value: 3500, date: 'Ontem', type: 'income', color: '#00D084' },
    { name: 'Uber', category: 'Transporte', value: 42.0, date: '2 dias atrás', type: 'expense', color: '#FFB84D' },
    { name: 'Cinema', category: 'Lazer', value: 80, date: '3 dias atrás', type: 'expense', color: '#00D4FF' },
    { name: 'Netflix', category: 'Assinatura', value: 25, date: '5 dias atrás', type: 'expense', color: '#6B5FFF' },
  ];

  return (
    <div className="dashboard-page">
      {/* Welcome Section */}
      <WelcomeCard
        userName="Gabriel"
        onAddTransaction={() => console.log('Add transaction')}
        onLinkCouple={() => console.log('Link couple')}
      />

      {/* Stats Grid */}
      <section className="dashboard-page__stats">
        <StatCard
          label="Total este mês"
          value={`R$ ${mockStats.totalMonth.toFixed(2)}`}
          color="primary"
          icon={<BalanceIcon />}
        />
        <StatCard
          label="Saldo pessoal"
          value={`R$ ${mockStats.personalBalance.toFixed(2)}`}
          color="secondary"
          icon={<PersonalIcon />}
        />
        <StatCard
          label="Casal (vinculado)"
          value={`R$ ${mockStats.coupleBalance.toFixed(2)}`}
          color="success"
          icon={<CoupleIcon />}
        />
        <StatCard
          label="Grupos"
          value={`${mockStats.groupBalance} transações`}
          color="danger"
          icon={<GroupIcon />}
        />
      </section>

      {/* Recent Transactions */}
      <section className="dashboard-page__recent">
        <div className="dashboard-page__section-header">
          <h3>Últimas Transações</h3>
          <a href="/transactions" className="dashboard-page__link">
            Ver tudo →
          </a>
        </div>

        <Card variant="default" padding="sm">
          <div className="dashboard-page__transaction-list">
            {mockTransactions.map((tx, idx) => (
              <TransactionListItem key={idx} {...tx} categoryColor={tx.color} />
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};
