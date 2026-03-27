import { useQuery } from '@tanstack/react-query';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './features/dashboard/HomePage';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { ComponentLab } from './features/dev/ComponentLab';
import { apiFetch, getStoredToken } from './services/api';

import type { SafeUser } from './types/user';

export function App() {
  const token = getStoredToken();
  const { data: me, isLoading } = useQuery({
    queryKey: ['me', token],
    queryFn: () => apiFetch<SafeUser>('/auth/me'),
    enabled: Boolean(token),
    retry: false,
  });

  return (
    <div className="app">
      <header className="header">
        <strong>Centro Financeiro Social</strong>
        <nav>
          <Link to="/">Home</Link>
          {!token && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
      <main className="main">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                user={me}
                isLoading={Boolean(token) && isLoading}
                hasToken={Boolean(token)}
              />
            }
          />
          <Route
            path="/login"
            element={token ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/" replace /> : <RegisterPage />}
          />
          <Route path="/dev/lab" element={<ComponentLab />} />
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </main>
    </div>
  );
}
