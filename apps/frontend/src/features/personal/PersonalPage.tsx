import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch, clearStoredToken } from '../../services/api';
import { Button } from '../../design-system/Button/Button';
import { Card } from '../../design-system/Card/Card';
import { Badge } from '../../design-system/Badge/Badge';
import {
  IconFilter,
  IconCalendar,
  IconHome,
  IconUtensils,
  IconBus,
  IconFilm,
  IconDumbbell,
  IconShoppingBag,
  IconLightbulb,
  IconDashboard,
  IconSettings,
} from '../../design-system/Icons';
import { Sidebar } from '../../layout/Sidebar';
import { Header } from '../../layout/Header';
import './PersonalPage.css';
import type { DashboardData } from '../../types/dashboard';
import type { SafeUser } from '../../types/user';
import { Category, TransactionType } from '../../types/transaction';

type Props = {
  user?: SafeUser;
  isLoading: boolean;
  hasToken: boolean;
};

const categoryIcons = {
  [Category.HOUSING]: <IconHome size={16} />,
  [Category.FOOD]: <IconUtensils size={16} />,
  [Category.TRANSPORT]: <IconBus size={16} />,
  [Category.ENTERTAINMENT]: <IconFilm size={16} />,
  [Category.HEALTH]: <IconDumbbell size={16} />,
  [Category.SHOPPING]: <IconShoppingBag size={16} />,
  [Category.EDUCATION]: <IconLightbulb size={16} />,
  [Category.UTILITIES]: <IconSettings size={16} />,
  [Category.OTHER]: <IconDashboard size={16} />,
} satisfies Record<Category, React.ReactNode>;

const categoryLabels = {
  [Category.FOOD]: 'Alimentação',
  [Category.TRANSPORT]: 'Transporte',
  [Category.HOUSING]: 'Moradia',
  [Category.ENTERTAINMENT]: 'Lazer',
  [Category.HEALTH]: 'Saúde',
  [Category.SHOPPING]: 'Compras',
  [Category.EDUCATION]: 'Educação',
  [Category.UTILITIES]: 'Serviços',
  [Category.OTHER]: 'Outros',
} satisfies Record<Category, string>;

const categoryAccentClasses = {
  [Category.HOUSING]: { bg: 'bg-blue-light', bar: 'bar-blue' },
  [Category.FOOD]: { bg: 'bg-green-light', bar: 'bar-green' },
  [Category.TRANSPORT]: { bg: 'bg-red-light', bar: 'bar-red' },
  [Category.ENTERTAINMENT]: { bg: 'bg-blue-light', bar: 'bar-blue' },
  [Category.HEALTH]: { bg: 'bg-green-light', bar: 'bar-green' },
  [Category.SHOPPING]: { bg: 'bg-red-light', bar: 'bar-red' },
  [Category.EDUCATION]: { bg: 'bg-blue-light', bar: 'bar-blue' },
  [Category.UTILITIES]: { bg: 'bg-green-light', bar: 'bar-green' },
  [Category.OTHER]: { bg: 'bg-red-light', bar: 'bar-red' },
} satisfies Record<Category, { bg: string; bar: string }>;

export function PersonalPage({ user, isLoading, hasToken }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: dashboard, isLoading: isDashboardLoading, isError } = useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: () => apiFetch<DashboardData>('/dashboard'),
    enabled: Boolean(user?.id),
  });

  function logout() {
    clearStoredToken();
    queryClient.clear();
    navigate('/', { replace: true });
  }

  function formatCurrency(value: number, maximumFractionDigits = 2): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits,
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
      'en-US',
      {
        month: 'long',
        year: 'numeric',
      },
    );
  }

  function formatTransactionDate(value: string): string {
    return new Date(value).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function getComparisonBadge() {
    if (!dashboard) {
      return { text: '', variant: 'neutral' as const };
    }

    const percentage = dashboard.personal.monthOverMonthPercentage;
    if (percentage === null) {
      return {
        text: 'No previous-month baseline',
        variant: 'neutral' as const,
      };
    }

    if (percentage <= 0) {
      return {
        text: `VS LAST MONTH ${percentage.toFixed(2)}%`,
        variant: 'success' as const,
      };
    }

    return {
      text: `VS LAST MONTH +${percentage.toFixed(2)}%`,
      variant: 'warning' as const,
    };
  }

  function getTransactionSourceLabel(type: TransactionType): string {
    switch (type) {
      case TransactionType.COUPLE:
        return 'Couple Account';
      case TransactionType.GROUP:
        return 'Group Split';
      default:
        return 'Personal Wallet';
    }
  }

  if (hasToken && isLoading) {
    return <div className="loading-state">Loading session…</div>;
  }

  if (hasToken && user) {
    if (isDashboardLoading) {
      return <div className="loading-state">Loading personal data…</div>;
    }

    if (isError || !dashboard) {
      return <div className="loading-state">Unable to load personal data.</div>;
    }

    const comparisonBadge = getComparisonBadge();
    const secondaryHighlights = dashboard.personal.secondaryHighlights;
    const personalRecentTransactions = dashboard.recentTransactions.filter(
      (transaction) => transaction.type === TransactionType.PERSONAL,
    );

    return (
      <div className="personal-page">
        <Sidebar user={user} activePath="/personal" />

        <main className="main-content">
          <Header user={user} onLogout={logout} />

          <div className="personal-body">
            <section className="hero-section">
              <div className="hero-content">
                <p className="hero-title">Personal Statement</p>
                <h1 className="hero-balance">
                  {formatCurrency(dashboard.personal.currentMonthTotal)}
                </h1>
                <p className="hero-subtitle">
                  Total spent in {formatMonth(dashboard.period.month)}
                </p>
              </div>
              <div className="hero-badge-container">
                <Badge variant={comparisonBadge.variant} pill className="comparison-badge">
                  {comparisonBadge.text}
                </Badge>
              </div>
            </section>

            <section className="summary-grid">
              {dashboard.personal.categoryBreakdown.length > 0 ? (
                dashboard.personal.categoryBreakdown.map((categoryItem) => {
                  const accent = categoryAccentClasses[categoryItem.category];
                  return (
                    <Card key={categoryItem.category} className="summary-card">
                      <div className="summary-card-header">
                        <div className={`icon-circle ${accent.bg}`}>
                          {categoryIcons[categoryItem.category]}
                        </div>
                        <span className="summary-card-amount">
                          {formatCurrency(categoryItem.amount)}
                        </span>
                      </div>
                      <div className="summary-card-footer">
                        <p className="summary-card-label">
                          {categoryLabels[categoryItem.category]}
                        </p>
                        <div className="progress-container">
                          <div
                            className={`progress-bar ${accent.bar}`}
                            style={{
                              width: `${Math.min(categoryItem.percentage, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="summary-card-subtext">
                          {categoryItem.percentage.toFixed(2)}% of budget
                        </span>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <Card className="summary-empty-card">
                  No personal category activity found for this month.
                </Card>
              )}
            </section>

            <section className="secondary-summary">
              <div className="secondary-items">
                {secondaryHighlights.map((highlight) => (
                  <div key={highlight.label} className="secondary-item">
                    <span className="secondary-item-label">{highlight.label}</span>
                    <span className="secondary-item-value">
                      {formatCurrency(highlight.amount)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="avatar-stack">
                <div className="avatar-capsule bg-blue-mid">MO</div>
                <div className="avatar-capsule bg-green-mid">GYM</div>
                <div className="avatar-capsule bg-orange-mid">PUB</div>
              </div>
            </section>

            <section className="activity-section">
              <div className="section-header">
                <h2 className="section-title">Recent Activity</h2>
                <div className="section-actions">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<IconFilter size={14} />}
                    disabled
                    title="Filtering is not available on this page yet."
                  >
                    Filter
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<IconCalendar size={14} />}
                    disabled
                    title="Date filtering is not available on this page yet."
                  >
                    Date
                  </Button>
                </div>
              </div>

              <div className="activity-list">
                {personalRecentTransactions.length > 0 ? (
                  personalRecentTransactions.map((tx) => (
                    <Link
                      key={tx.id}
                      to={`/expense/edit/${tx.id}`}
                      className="activity-item-link"
                    >
                      <div className="activity-item">
                        <div className="activity-icon">
                          {categoryIcons[tx.category] || <IconDashboard size={20} />}
                        </div>
                        <div className="activity-content">
                          <p className="activity-name">{tx.name}</p>
                          <div className="activity-meta">
                            <span className="activity-date">
                              {formatTransactionDate(tx.date)}
                            </span>
                            <Badge variant="success" pill>
                              {categoryLabels[tx.category]}
                            </Badge>
                          </div>
                        </div>
                        <div className="activity-amount-group">
                          <p className="activity-amount">
                            - {formatCurrency(Number(tx.amount))}
                          </p>
                          <p className="activity-source">
                            {getTransactionSourceLabel(tx.type)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <Card className="summary-empty-card">
                    No personal activity found for this user.
                  </Card>
                )}
              </div>

              <div className="load-more">
                <button className="load-more-btn" disabled>
                  Load More Transactions
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="auth-landing">
      <h1>Financial Center</h1>
      <p>Manage your personal, couple, and group expenses.</p>
      <div className="auth-links">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
