import { Link, useLocation } from 'react-router-dom';
import { Button } from '../../design-system/Button/Button';
import { Card } from '../../design-system/Card/Card';
import { Input } from '../../design-system/Input/Input';
import {
  IconDashboard,
  IconUser,
  IconHeart,
  IconUsers,
  IconSearch,
  IconBell,
  IconSettings,
  IconPlus,
  IconWallet,
  IconShoppingBag,
  IconUtensils,
} from '../../design-system/Icons';
import './HomePage.css';
import type { SafeUser } from '../../types/user';

type Props = {
  user?: SafeUser;
  isLoading: boolean;
  hasToken: boolean;
};

export function HomePage({ user, isLoading, hasToken }: Props) {
  const location = useLocation();

  const getNavItemClass = (path: string) => {
    return `nav-item ${location.pathname === path ? 'nav-item--active' : ''}`;
  };

  // Mock data for Dashboard
  const availableBalance = "12.450,00";
  const spentThisMonth = "4.280,00";
  const economyPercentage = "12.5%";
  const coupleDebt = "450,20";
  const coupleOwesYou = "1.280,00";

  const recentTransactions = [
    {
      id: "1",
      name: "Supermercado Pão de Açúcar",
      category: "Alimentação",
      date: "Hoje, 14:30",
      amount: "- R$ 342,50",
      type: "expense",
      icon: <IconShoppingBag size={24} />
    },
    {
      id: "2",
      name: "Freelance Editorial",
      category: "Renda",
      date: "Ontem",
      amount: "+ R$ 2.100,00",
      type: "income",
      icon: <IconWallet size={24} />
    },
    {
      id: "3",
      name: "Restaurante Mirante",
      category: "Lazer",
      date: "12 Out",
      amount: "- R$ 185,00",
      type: "expense",
      icon: <IconUtensils size={24} />
    },
  ];

  const groups = [
    { id: "1", name: "Viagem Praia", amount: "R$ 0,00", avatar: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=150" },
    { id: "2", name: "Apartamento 402", amount: "- R$ 85,90", avatar: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=150" },
    { id: "3", name: "Estudos Pós", amount: "R$ 150,00" },
  ];

  if (isLoading) {
    return <div className="loading-state">Loading…</div>;
  }

  if (hasToken && user) {
    return (
      <div className="dashboard-page">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <h1>Editorial Finance</h1>
          </div>

          <nav className="sidebar-nav">
            <Link to="/" className={getNavItemClass('/')}>
              <IconDashboard size={20} />
              Dashboard
            </Link>
            <Link to="/personal" className={getNavItemClass('/personal')}>
              <IconUser size={20} />
              Personal
            </Link>
            <Link to="/couple" className={getNavItemClass('/couple')}>
              <IconHeart size={20} />
              Couple
            </Link>
            <Link to="/groups" className={getNavItemClass('/groups')}>
              <IconUsers size={20} />
              Groups
            </Link>
          </nav>

          <div className="sidebar-footer">
            <Button
              variant="primary"
              size="md"
              icon={<IconPlus size={16} />}
              className="w-full"
            >
              New Expense
            </Button>
          </div>
        </aside>

        <main className="main-content">
          <header className="header">
            <div className="header-search">
              <IconSearch size={18} className="search-icon" />
              <Input
                variant="underlined"
                placeholder="Search transactions..."
                className="search-input"
              />
            </div>
            <div className="header-actions">
              <IconBell size={20} className="action-icon" />
              <IconSettings size={20} className="action-icon" />
              <div className="user-profile">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                  alt="User profile"
                  className="user-avatar"
                />
              </div>
            </div>
          </header>

          <div className="dashboard-body">
            <div className="dashboard-grid">
              <Card className="balance-card">
                <p className="card-title">SALDO DISPONÍVEL</p>
                <h2 className="main-balance">R$ {availableBalance}</h2>
                <div className="balance-summary">
                  <div className="balance-item">
                    <p className="balance-label">Gasto no Mês</p>
                    <p className="balance-value">R$ {spentThisMonth}</p>
                  </div>
                  <div className="balance-item">
                    <p className="balance-label">Economia</p>
                    <p className="balance-value success">+{economyPercentage}</p>
                  </div>
                </div>
              </Card>

              <Card className="couple-summary-card">
                <div className="card-header-icon">
                  <IconHeart size={24} className="couple-header-icon" />
                  <p className="card-title">Resumo Casal</p>
                </div>
                <div className="couple-amounts">
                  <div className="couple-sub-card couple-sub-card--debt">
                    <p className="couple-label">Você deve</p>
                    <p className="couple-value">R$ {coupleDebt}</p>
                  </div>
                  <div className="couple-sub-card couple-sub-card--credit">
                    <p className="couple-label">Devem para você</p>
                    <p className="couple-value">R$ {coupleOwesYou}</p>
                  </div>
                </div>
              </Card>

              <div className="recent-transactions-section">
                <div className="section-header">
                  <h3 className="section-title">Transações Recentes</h3>
                  <Link to="#" className="view-all">Ver todas</Link>
                </div>
                <div className="transactions-list">
                  {recentTransactions.map(tx => (
                    <Card key={tx.id} className="transaction-item-card">
                      <div className={`transaction-icon-wrapper transaction-icon--${tx.type}`}>
                        {tx.icon}
                      </div>
                      <div className="transaction-details">
                        <p className="transaction-name">{tx.name}</p>
                        <p className="transaction-meta">{tx.category} • {tx.date}</p>
                      </div>
                      <p className={`transaction-amount ${tx.type === 'expense' ? 'danger' : 'success'}`}>
                        {tx.amount}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="groups-card">
                <p className="card-title">Seus Grupos</p>
                <div className="groups-list">
                  {groups.map(group => (
                    <div key={group.id} className="group-item">
                      {group.avatar ? (
                        <img src={group.avatar} alt={group.name} className="group-avatar" />
                      ) : (
                        <div className="group-avatar-icon">
                          <IconUsers size={24} />
                        </div>
                      )}
                      <p className="group-name">{group.name}</p>
                      <p className={`group-amount ${group.amount.startsWith('-') ? 'danger' : 'success'}`}>
                        {group.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="auth-landing">
      <h1>Centro Financeiro Social</h1>
      <p>Manage your personal, couple, and group expenses.</p>
      <div className="auth-links">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
