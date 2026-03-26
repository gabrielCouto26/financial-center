import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { clearStoredToken } from '../../services/api';
import { CouplePanel } from '../couple/CouplePanel';
import { TransactionForm } from '../transactions/TransactionForm';
import { TransactionList } from '../transactions/TransactionList';
import type { SafeUser } from '../../types/user';

type Props = {
  user?: SafeUser;
  isLoading: boolean;
  hasToken: boolean;
};

export function HomePage({ user, isLoading, hasToken }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function logout() {
    clearStoredToken();
    queryClient.removeQueries({ queryKey: ['me'] });
    queryClient.removeQueries({ queryKey: ['couple'] });
    queryClient.removeQueries({ queryKey: ['couple-balance'] });
    queryClient.removeQueries({ queryKey: ['transactions'] });
    navigate('/', { replace: true });
  }

  if (hasToken && isLoading) {
    return <p>Loading session…</p>;
  }

  if (hasToken && user) {
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
            <CouplePanel enabled currentUserId={user.id} />
            <TransactionList currentUserId={user.id} />
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
