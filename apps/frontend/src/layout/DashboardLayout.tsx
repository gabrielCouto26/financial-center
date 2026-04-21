import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { SafeUser } from '../types/user';
import './DashboardLayout.css';

type Props = {
  user?: SafeUser;
  onLogout?: () => void;
  activePath?: string;
  children: React.ReactNode;
};

export function DashboardLayout({ user, onLogout, activePath, children }: Props) {
  return (
    <div className="dashboard-layout">
      <Header user={user} onLogout={onLogout} />
      <Sidebar activePath={activePath} />
      <main className="dashboard-layout__main">
        {children}
      </main>
    </div>
  );
}
