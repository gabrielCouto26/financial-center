import { DashboardLayout } from './layout/DashboardLayout';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { PersonalPage } from './features/personal/PersonalPage';
import { CouplePage } from './features/couple/CouplePage';
import { TransactionsPage } from './features/transactions/TransactionsPage';

function App() {
  const currentPath = window.location.pathname;

  return (
    <DashboardLayout currentPath={currentPath}>
      {currentPath === '/' && <DashboardPage />}
      {currentPath === '/personal' && <PersonalPage />}
      {currentPath === '/couple' && <CouplePage />}
      {currentPath === '/transactions' && <TransactionsPage />}
      {/* Default to Dashboard if route not found */}
      {!['/', '/personal', '/couple', '/transactions'].includes(currentPath) && <DashboardPage />}
    </DashboardLayout>
  );
}

export default App;
