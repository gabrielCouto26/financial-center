import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './features/dashboard/HomePage';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { ComponentLab } from './features/dev/ComponentLab';
import { PersonalPage } from './features/personal/PersonalPage';
import { CouplePage } from './features/couple/CouplePage';
import { NewTransactionPage } from './features/transactions/NewTransactionPage';
import { EditTransactionPage } from './features/transactions/EditTransactionPage';
import { apiFetch, getStoredToken } from './services/api';

import type { SafeUser } from './types/user';

export function App() {
  const [token, setToken] = useState(getStoredToken());

  useEffect(() => {
    const handleAuth = () => setToken(getStoredToken());
    window.addEventListener('auth-change', handleAuth);
    return () => window.removeEventListener('auth-change', handleAuth);
  }, []);

  const { data: me, isLoading, isError } = useQuery({
    queryKey: ['me', token],
    queryFn: () => apiFetch<SafeUser>('/auth/me'),
    enabled: Boolean(token),
    retry: false,
  });

  return (
    <div className="app-root">
      <Routes>
        <Route
          path="/"
          element={
            me ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <HomePage
                user={me}
                isLoading={Boolean(token) && isLoading}
                hasToken={Boolean(token) && !isError}
              />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <HomePage
              user={me}
              isLoading={Boolean(token) && isLoading}
              hasToken={Boolean(token) && !isError}
            />
          }
        />
        <Route
          path="/login"
          element={me ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/personal"
          element={
            <PersonalPage
              user={me}
              isLoading={Boolean(token) && isLoading}
              hasToken={Boolean(token) && !isError}
            />
          }
        />
        <Route
          path="/couple"
          element={
            <CouplePage
              user={me}
              isLoading={Boolean(token) && isLoading}
              hasToken={Boolean(token) && !isError}
            />
          }
        />
        <Route
          path="/register"
          element={me ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
        />
        <Route
          path="/forgot-password"
          element={me ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />}
        />
        <Route
          path="/expense/new"
          element={
            <NewTransactionPage
              user={me}
              isLoading={Boolean(token) && isLoading}
              hasToken={Boolean(token) && !isError}
            />
          }
        />
        <Route
          path="/expense/edit/:id"
          element={
            <EditTransactionPage
              user={me}
              isLoading={Boolean(token) && isLoading}
              hasToken={Boolean(token) && !isError}
            />
          }
        />
        <Route path="/dev/lab" element={<ComponentLab />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
