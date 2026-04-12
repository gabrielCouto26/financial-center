import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../../design-system/Button/Button';
import { Card } from '../../design-system/Card/Card';
import { Input } from '../../design-system/Input/Input';
import { apiFetch } from '../../services/api';
import {
  IconDashboard,
  IconUser,
  IconHeart,
  IconUsers,
  IconSearch,
  IconBell,
  IconSettings,
  IconPlus,
  IconBus,
  IconDumbbell,
  IconFilm,
  IconHome,
  IconLightbulb,
  IconShoppingBag,
  IconUtensils,
} from '../../design-system/Icons';
import './HomePage.css';
import type { DashboardData } from '../../types/dashboard';
import {
  Category,
  TransactionDirection,
  TransactionType,
} from '../../types/transaction';
import type { SafeUser } from '../../types/user';

type Props = {
  user?: SafeUser;
  isLoading: boolean;
  hasToken: boolean;
};

export function HomePage({ user, isLoading, hasToken }: Props) {
  const location = useLocation();
  const { data: dashboard, isLoading: isDashboardLoading, isError } = useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: () => apiFetch<DashboardData>('/dashboard'),
    enabled: Boolean(user?.id),
  });

  const getNavItemClass = (path: string) => {
    return `nav-item ${location.pathname === path ? 'nav-item--active' : ''}`;
  };

  const categoryIcons = {
    [Category.HOUSING]: <IconHome size={24} />,
    [Category.FOOD]: <IconUtensils size={24} />,
    [Category.TRANSPORT]: <IconBus size={24} />,
    [Category.ENTERTAINMENT]: <IconFilm size={24} />,
    [Category.HEALTH]: <IconDumbbell size={24} />,
    [Category.SHOPPING]: <IconShoppingBag size={24} />,
    [Category.EDUCATION]: <IconLightbulb size={24} />,
    [Category.UTILITIES]: <IconSettings size={24} />,
    [Category.OTHER]: <IconDashboard size={24} />,
  } satisfies Record<Category, React.ReactNode>;

  const categoryLabels = {
    [Category.FOOD]: 'Alimentacao',
    [Category.TRANSPORT]: 'Transporte',
    [Category.HOUSING]: 'Moradia',
    [Category.ENTERTAINMENT]: 'Lazer',
    [Category.HEALTH]: 'Saude',
    [Category.SHOPPING]: 'Compras',
    [Category.EDUCATION]: 'Educacao',
    [Category.UTILITIES]: 'Servicos',
    [Category.OTHER]: 'Outros',
  } satisfies Record<Category, string>;

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  function formatMonth(monthKey: string): string {
    const [year, month] = monthKey.split('-');
    const parsedYear = Number.parseInt(year, 10);
    const parsedMonth = Number.parseInt(month, 10);
    if (
      Number.isNaN(parsedYear) ||
      Number.isNaN(parsedMonth) ||
      parsedMonth < 1 ||
      parsedMonth > 12
    ) {
      return monthKey;
    }

    return new Date(parsedYear, parsedMonth - 1, 1).toLocaleDateString(
      'pt-BR',
      {
        month: 'long',
        year: 'numeric',
      },
    );
  }

  function formatTransactionDate(value: string): string {
    return new Date(value).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  }

  function getTransactionSourceLabel(
    type: TransactionType,
    direction: TransactionDirection,
  ): string {
    const baseLabel = direction === TransactionDirection.INCOME ? 'Receita' : 'Despesa';

    switch (type) {
      case TransactionType.COUPLE:
        return `${baseLabel} do casal`;
      case TransactionType.GROUP:
        return `${baseLabel} em grupo`;
      default:
        return `${baseLabel} pessoal`;
    }
  }

  if (isLoading) {
    return <div className="loading-state">Loading…</div>;
  }

  if (hasToken && user) {
    if (isDashboardLoading) {
      return <div className="loading-state">Loading dashboard…</div>;
    }

    if (isError || !dashboard) {
      return <div className="loading-state">Unable to load dashboard.</div>;
    }

    const balanceClassName =
      dashboard.summary.currentBalance < 0 ? 'danger' : 'success';
    const userInitial = user.email.slice(0, 1).toUpperCase();

    return (
      <div className="dashboard-page">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <h1>Editorial Finance</h1>
          </div>

          <nav className="sidebar-nav">
            <Link to="/dashboard" className={getNavItemClass('/dashboard')}>
              <IconDashboard size={20} />
              Dashboard
            </Link>
            <Link to="/personal" className={getNavItemClass('/personal')}>
              <IconUser size={20} />
              Personal
            </Link>
            <span className="nav-item nav-item--disabled" aria-disabled="true">
              <IconHeart size={20} />
              Couple
            </span>
            <span className="nav-item nav-item--disabled" aria-disabled="true">
              <IconUsers size={20} />
              Groups
            </span>
          </nav>

          <div className="sidebar-footer">
            <Link to="/new-expense" className="w-full">
              <Button
                variant="primary"
                size="md"
                icon={<IconPlus size={16} />}
                className="w-full"
              >
                New Expense
              </Button>
            </Link>
          </div>
        </aside>

        <main className="main-content">
          <header className="header">
            <div className="header-search">
              <IconSearch size={18} className="search-icon" />
              <Input
                variant="underlined"
                placeholder="Busca indisponivel nesta tela"
                className="search-input"
                disabled
              />
            </div>
            <div className="header-actions">
              <IconBell size={20} className="action-icon" />
              <IconSettings size={20} className="action-icon" />
              <div className="user-profile">
                <span className="user-avatar-fallback">{userInitial}</span>
              </div>
            </div>
          </header>

          <div className="dashboard-body">
            <div className="dashboard-grid">
              <Card className="balance-card">
                <div className="balance-header">
                  <p className="card-title">SALDO DISPONÍVEL</p>
                  <h2 className={`main-balance ${balanceClassName}`}>
                    {formatCurrency(dashboard.summary.currentBalance)}
                  </h2>
                </div>

                <div className="balance-summary">
                  <div className="balance-item">
                    <p className="balance-label">Gasto no Mês</p>
                    <p className="balance-value">
                      {formatCurrency(dashboard.summary.totalSpentThisMonth)}
                    </p>
                  </div>
                  <div className="balance-item">
                    <p className="balance-label">Período</p>
                    <p className="balance-value">{formatMonth(dashboard.period.month)}</p>
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
                    <p className="couple-value">
                      {formatCurrency(dashboard.couple.youOwe)}
                    </p>
                  </div>
                  <div className="couple-sub-card couple-sub-card--credit">
                    <p className="couple-label">Devem para você</p>
                    <p className="couple-value">
                      {formatCurrency(dashboard.couple.owedToYou)}
                    </p>
                  </div>
                </div>
              </Card>

              <div className="recent-transactions-section">
                <div className="section-header">
                  <h3 className="section-title">Transações Recentes</h3>
                </div>
                <div className="transactions-list">
                  {dashboard.recentTransactions.length > 0 ? (
                    dashboard.recentTransactions.map((tx) => (
                      <Card key={tx.id} className="transaction-item-card">
                        <div
                          className={`transaction-icon-wrapper ${
                            tx.direction === TransactionDirection.INCOME
                              ? 'transaction-icon--income'
                              : 'transaction-icon--expense'
                          }`}
                        >
                          {categoryIcons[tx.category]}
                        </div>
                        <div className="transaction-details">
                          <p className="transaction-name">{tx.name}</p>
                          <p className="transaction-meta">
                            {categoryLabels[tx.category]} • {formatTransactionDate(tx.date)}
                          </p>
                        </div>
                        <div className="transaction-amount-block">
                          <p
                            className={`transaction-amount ${
                              tx.direction === TransactionDirection.INCOME ? 'success' : 'danger'
                            }`}
                          >
                            {formatCurrency(Number(tx.amount))}
                          </p>
                          <p className="transaction-source">
                            {getTransactionSourceLabel(tx.type, tx.direction)}
                          </p>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="empty-card">
                      Nenhuma transação encontrada para este usuário.
                    </Card>
                  )}
                </div>
              </div>

              <Card className="groups-card">
                <p className="card-title">Seus Grupos</p>
                <div className="coming-soon-container">
                  <div className="coming-soon-icon">
                    <IconUsers size={48} />
                  </div>
                  <h4 className="coming-soon-title">Em breve</h4>
                  <p className="coming-soon-text">
                    Estamos preparando uma experiência incrível para você gerenciar despesas em grupo.
                  </p>
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
