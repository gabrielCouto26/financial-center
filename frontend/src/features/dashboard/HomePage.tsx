import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch, clearStoredToken } from '../../services/api';
import { CouplePanel } from '../couple/CouplePanel';
import { CoupleOverviewCard } from './CoupleOverviewCard';
import { GroupPanel } from '../groups/GroupPanel';
import { GroupsOverviewCard } from './GroupsOverviewCard';
import { RecentTransactionsCard } from './RecentTransactionsCard';
import { SummaryCards } from './SummaryCards';
import { TransactionForm } from '../transactions/TransactionForm';
import type { DashboardData } from '../../types/dashboard';
import type { SafeUser } from '../../types/user';

type Props = {
  user?: SafeUser;
  isLoading: boolean;
  hasToken: boolean;
};

export function HomePage({ user, isLoading, hasToken }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: dashboard, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: () => apiFetch<DashboardData>('/dashboard'),
    enabled: Boolean(user?.id),
  });

  function logout() {
    clearStoredToken();
    queryClient.removeQueries({ queryKey: ['me'] });
    queryClient.removeQueries({ queryKey: ['couple'] });
    queryClient.removeQueries({ queryKey: ['couple-balance'] });
    queryClient.removeQueries({ queryKey: ['groups'] });
    queryClient.removeQueries({ queryKey: ['group-detail'] });
    queryClient.removeQueries({ queryKey: ['group-balance'] });
    queryClient.removeQueries({ queryKey: ['dashboard'] });
    queryClient.removeQueries({ queryKey: ['transactions'] });
    navigate('/', { replace: true });
  }

  if (hasToken && isLoading) {
    return <p>Loading session…</p>;
  }

  if (hasToken && user) {
    if (isDashboardLoading || !dashboard) {
      return <p>Loading dashboard…</p>;
    }

    return (
      <section>
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span>Signed in as <strong>{user.email}</strong></span>
            <button type="button" onClick={logout}>
              Log out
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          <aside className="sidebar">
            <TransactionForm currentUserId={user.id} />
          </aside>

          <main className="main-content">
            <SummaryCards
              summary={dashboard.summary}
              month={dashboard.period.month}
            />
            <div className="overview-grid">
              <CoupleOverviewCard couple={dashboard.couple} />
              <GroupsOverviewCard groups={dashboard.groups} />
            </div>
            <RecentTransactionsCard
              transactions={dashboard.recentTransactions}
            />
            <div className="management-grid">
              <CouplePanel enabled currentUserId={user.id} />
              <GroupPanel currentUserId={user.id} />
            </div>
          </main>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1>Centro Financeiro Social</h1>
      <p>
        Epic 2 foundation: create an account or log in to manage your personal expenses.
      </p>
      <p>
        <Link to="/login">Login</Link> · <Link to="/register">Register</Link>
      </p>
    </section>
  );
}
