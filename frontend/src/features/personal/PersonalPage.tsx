import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch, clearStoredToken } from '../../services/api';
import { Button } from '../../design-system/Button/Button';
import { Card } from '../../design-system/Card/Card';
import { Badge } from '../../design-system/Badge/Badge';
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
  IconFilter,
  IconCalendar,
  IconHome,
  IconUtensils,
  IconBus,
  IconFilm,
  IconDumbbell,
  IconShoppingBag,
  IconLightbulb,
} from '../../design-system/Icons';
import './PersonalPage.css';
import type { DashboardData } from '../../types/dashboard';
import type { SafeUser } from '../../types/user';
import { Category, TransactionType } from '../../types/transaction';

type Props = {
  user?: SafeUser;
  isLoading: boolean;
  hasToken: boolean;
};

const categoryIcons: Record<string, React.ReactNode> = {
  [Category.HOUSING]: <IconHome size={16} />,
  [Category.FOOD]: <IconUtensils size={16} />,
  [Category.TRANSPORT]: <IconBus size={16} />,
  [Category.ENTERTAINMENT]: <IconFilm size={16} />,
  [Category.HEALTH]: <IconDumbbell size={16} />,
  [Category.SHOPPING]: <IconShoppingBag size={16} />,
  [Category.EDUCATION]: <IconLightbulb size={16} />,
  [Category.UTILITIES]: <IconSettings size={16} />,
  [Category.OTHER]: <IconDashboard size={16} />,
};

const categoryLabels: Record<Category, string> = {
  [Category.FOOD]: 'Alimentação',
  [Category.TRANSPORT]: 'Transporte',
  [Category.HOUSING]: 'Moradia',
  [Category.ENTERTAINMENT]: 'Lazer',
  [Category.HEALTH]: 'Saúde',
  [Category.SHOPPING]: 'Compras',
  [Category.EDUCATION]: 'Educação',
  [Category.UTILITIES]: 'Serviços',
  [Category.OTHER]: 'Outros',
};

export function PersonalPage({ user, isLoading, hasToken }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: dashboard, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: () => apiFetch<DashboardData>('/dashboard'),
    enabled: Boolean(user?.id),
  });

  function logout() {
    clearStoredToken();
    queryClient.clear();
    navigate('/', { replace: true });
  }

  if (hasToken && isLoading) {
    return <div className="loading-state">Loading session…</div>;
  }

  if (hasToken && user) {
    if (isDashboardLoading || !dashboard) {
      return <div className="loading-state">Loading personal data…</div>;
    }

    const formattedBalance = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(dashboard.summary.totalSpentThisMonth);

    const [year, month] = (dashboard.period?.month || "2023-10").split('-');
    const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'long' });
    const fullDateLabel = `Total spent in ${monthName} ${year}`;

    // Mock category breakdown for fidelity if not provided by backend
    const categories = [
      {
        label: 'Moradia',
        amount: 2100,
        percentage: 49,
        icon: <IconHome size={16} />,
        bg: 'bg-blue-light',
        bar: 'bar-blue',
      },
      {
        label: 'Alimentação',
        amount: 840,
        percentage: 35,
        icon: <IconUtensils size={16} />,
        bg: 'bg-green-light',
        bar: 'bar-green',
      },
      {
        label: 'Transporte',
        amount: 450.2,
        percentage: 20,
        icon: <IconBus size={16} />,
        bg: 'bg-red-light',
        bar: 'bar-red',
      },
    ];

    return (
      <div className="personal-page">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <h1>Editorial Finance</h1>
          </div>

          <nav className="sidebar-nav">
            <Link to="/" className="nav-item">
              <IconDashboard size={20} />
              Dashboard
            </Link>
            <Link to="/" className="nav-item nav-item--active">
              <IconUser size={20} />
              Personal
            </Link>
            <Link to="/" className="nav-item">
              <IconHeart size={20} />
              Couple
            </Link>
            <Link to="/" className="nav-item">
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
              <div className="user-profile" onClick={logout}>
                <IconUser size={24} />
              </div>
            </div>
          </header>

          <div className="personal-body">
            <section className="hero-section">
              <div>
                <p className="hero-title">Personal Statement</p>
                <h1 className="hero-balance">{formattedBalance}</h1>
                <p className="hero-subtitle">{fullDateLabel}</p>
              </div>
              <Badge variant="success" pill>
                VS LAST MONTH ~ 12.5%
              </Badge>
            </section>

            <section className="summary-grid">
              {categories.map((cat, i) => (
                <Card key={i} className="summary-card">
                  <div className="summary-card-header">
                    <div className={`icon-circle ${cat.bg}`}>
                      {cat.icon}
                    </div>
                    <span className="summary-card-amount">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        maximumFractionDigits: 0,
                      }).format(cat.amount)}
                    </span>
                  </div>
                  <div className="summary-card-footer">
                    <p className="summary-card-label">{cat.label}</p>
                    <div className="progress-container">
                      <div
                        className={`progress-bar ${cat.bar}`}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                    <span className="summary-card-subtext">
                      {cat.percentage}% of budget
                    </span>
                  </div>
                </Card>
              ))}
            </section>

            <section className="secondary-summary">
              <div className="secondary-items">
                <div className="secondary-item">
                  <span className="secondary-item-label">Lazer</span>
                  <span className="secondary-item-value">R$ 620,00</span>
                </div>
                <div className="secondary-item">
                  <span className="secondary-item-label">Outros</span>
                  <span className="secondary-item-value">R$ 270,30</span>
                </div>
              </div>
              <div className="avatar-stack">
                <div className="avatar bg-blue-light" />
                <div className="avatar bg-green-light" />
                <div className="avatar bg-red-light" />
              </div>
            </section>

            <section className="activity-section">
              <div className="section-header">
                <h2 className="section-title">Recent Activity</h2>
                <div className="section-actions">
                  <Button variant="secondary" size="sm" icon={<IconFilter size={14} />}>
                    Filter
                  </Button>
                  <Button variant="secondary" size="sm" icon={<IconCalendar size={14} />}>
                    Date
                  </Button>
                </div>
              </div>

              <div className="activity-list">
                {dashboard.recentTransactions.map((tx) => (
                  <div key={tx.id} className="activity-item">
                    <div className="activity-icon">
                      {categoryIcons[tx.category] || <IconDashboard size={20} />}
                    </div>
                    <div className="activity-content">
                      <p className="activity-name">{tx.name}</p>
                      <div className="activity-meta">
                        <span className="activity-date">
                          {new Date(tx.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <Badge variant="success" pill>
                          {categoryLabels[tx.category]}
                        </Badge>
                      </div>
                    </div>
                    <div className="activity-amount-group">
                      <p className="activity-amount">
                        - {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(Number(tx.amount))}
                      </p>
                      <p className="activity-source">
                        {tx.type === TransactionType.PERSONAL
                          ? 'Personal Wallet'
                          : tx.type === TransactionType.COUPLE
                            ? 'Couple Account'
                            : 'Group Split'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="load-more">
                <button className="load-more-btn">Load More Transactions</button>
              </div>
            </section>
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
