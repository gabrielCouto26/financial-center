import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { IconPlus } from '../../design-system/Icons';
import { Sidebar } from '../../layout/Sidebar';
import { Header } from '../../layout/Header';
import './CouplePage.css';
import type { SafeUser } from '../../types/user';
import type { CoupleSummary, CoupleBalance } from '../../types/couple';

import { CoupleBalanceHero } from './components/CoupleBalanceHero';
import { CategorySplitCard } from './components/CategorySplitCard';
import { SharedExpensesList } from './components/SharedExpensesList';
import { SettlementCard } from './components/SettlementCard';
import { CoupleProfileCard } from './components/CoupleProfileCard';
import { CoupleGoalCard } from './components/CoupleGoalCard';

type Props = {
  user?: SafeUser;
  isLoading: boolean;
  hasToken: boolean;
};

export function CouplePage({ user, isLoading }: Props) {
  const { data: coupleSummary, isLoading: isSummaryLoading, isError: isSummaryError } = useQuery({
    queryKey: ['coupleSummary', user?.id],
    queryFn: () => apiFetch<CoupleSummary>('/couple'),
    enabled: Boolean(user?.id),
  });

  const { data: coupleBalance, isLoading: isBalanceLoading, isError: isBalanceError } = useQuery({
    queryKey: ['coupleBalance', user?.id],
    queryFn: () => apiFetch<CoupleBalance>('/couple/balance'),
    enabled: Boolean(user?.id) && Boolean(coupleSummary),
  });

  if (isLoading || isSummaryLoading || isBalanceLoading) {
    return <div className="couple-loading-state">Carregando Casal...</div>;
  }

  if (isSummaryError || isBalanceError || !coupleSummary || !coupleBalance) {
    return (
      <div className="couple-error-state">
        <h2>Espaço do casal indisponível</h2>
        <p>Você pode não estar vinculado a um parceiro ainda, ou ocorreu um erro.</p>
      </div>
    );
  }

  return (
    <div className="couple-page">
      <Sidebar user={user} activePath="/couple" />

      <main className="main-content">
        <Header user={user} />

        <div className="couple-body">
          <CoupleBalanceHero summary={coupleSummary} balance={coupleBalance} />

          <div className="couple-content-grid">
            <div className="couple-col-main">
              <CategorySplitCard />
              {user && (
                <SharedExpensesList currentUserId={user.id} summary={coupleSummary} />
              )}
            </div>

            <div className="couple-col-side">
              <SettlementCard summary={coupleSummary} balance={coupleBalance} />
              <CoupleProfileCard user={user} summary={coupleSummary} balance={coupleBalance} />
              <CoupleGoalCard />
            </div>
          </div>
        </div>
      </main>

      {/* FAB */}
      <Link to="/expense/new" className="couple-fab">
        <IconPlus size={18} />
        + Despesa de Casal
      </Link>
    </div>
  );
}
