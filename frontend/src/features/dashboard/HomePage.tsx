import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { clearStoredToken } from '../../services/api';
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
    navigate('/', { replace: true });
  }

  if (hasToken && isLoading) {
    return <p>Loading session…</p>;
  }

  if (hasToken && user) {
    return (
      <section>
        <h1>Welcome</h1>
        <p>
          Signed in as <strong>{user.email}</strong>
        </p>
        <p className="hint">
          Session is stored in <code>localStorage</code> (JWT). Reload the page
          to verify persistence.
        </p>
        <button type="button" onClick={logout}>
          Log out
        </button>
      </section>
    );
  }

  return (
    <section>
      <h1>Centro Financeiro Social</h1>
      <p>
        Epic 1 foundation: create an account or log in to verify authentication.
      </p>
      <p>
        <Link to="/login">Login</Link> · <Link to="/register">Register</Link>
      </p>
    </section>
  );
}
