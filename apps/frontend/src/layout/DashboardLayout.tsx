import { useState, ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar, NavItem } from './Sidebar';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPath?: string;
}

export const DashboardLayout = ({ children, currentPath = '/' }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Ícones SVG inline para a navegação
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/',
      isActive: currentPath === '/',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      id: 'personal',
      label: 'Personal',
      href: '/personal',
      isActive: currentPath === '/personal',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: 'couple',
      label: 'Couple',
      href: '/couple',
      isActive: currentPath === '/couple',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: 'transactions',
      label: 'Transactions',
      href: '/transactions',
      isActive: currentPath === '/transactions',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 11h4" />
          <path d="M16 15h4" />
          <path d="M6 11h2" />
          <path d="M2 7V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" />
        </svg>
      ),
    },
  ];

  const handleNavigate = (href: string) => {
    // TODO: Implementar navegação com React Router
    window.location.pathname = href;
  };

  return (
    <div className="dashboard-layout">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="dashboard-layout__container">
        <Sidebar
          items={navItems}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="dashboard-layout__main">{children}</main>
      </div>
    </div>
  );
};
