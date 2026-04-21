import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../../services/api';
import { IconArrowRight } from '../../../design-system/Icons';
import type { PaginatedTransactions, Transaction } from '../../../types/transaction';
import type { CoupleSummary } from '../../../types/couple';
import { Category } from '../../../types/transaction';

type Props = {
  currentUserId: string;
  summary: CoupleSummary;
};

function getCategoryIcon(category: Category): string {
  switch (category) {
    case Category.FOOD: return '🍽';
    case Category.TRANSPORT: return '🚗';
    case Category.HOUSING: return '🏠';
    case Category.ENTERTAINMENT: return '🎬';
    case Category.HEALTH: return '💊';
    case Category.SHOPPING: return '🛒';
    case Category.EDUCATION: return '📚';
    case Category.UTILITIES: return '⚡';
    default: return '💳';
  }
}

function getCategoryIconClass(category: Category): string {
  if ([Category.FOOD, Category.ENTERTAINMENT].includes(category)) {
    return 'couple-expense-icon--secondary';
  }
  if ([Category.HOUSING, Category.UTILITIES].includes(category)) {
    return 'couple-expense-icon--accent';
  }
  return '';
}

export function SharedExpensesList({ currentUserId, summary }: Props) {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', 'couple', currentUserId],
    queryFn: () => apiFetch<PaginatedTransactions>('/transactions?type=COUPLE&limit=5'),
  });

  const partnerFirstName = summary.partner.name ?? summary.partner.email.split('@')[0];

  if (isLoading) {
    return (
      <div className="couple-section-card">
        <div style={{ height: 128, background: 'var(--ds-colors-background-muted)', borderRadius: 8 }} />
      </div>
    );
  }

  return (
    <div className="couple-section-card">
      <div className="couple-section-header">
        <h3 className="couple-section-title">Despesas Compartilhadas</h3>
        <button className="couple-view-all-btn">
          Ver todas <IconArrowRight size={14} />
        </button>
      </div>

      <div className="couple-expense-list">
        {transactions?.items?.slice(0, 3).map((tx: Transaction) => {
          const youPaid = tx.paidByUserId === currentUserId;
          const paidLabel = youPaid ? 'você' : partnerFirstName;

          let youOweAmount = 0;
          let partnerOwesAmount = 0;

          tx.splits.forEach((split) => {
            const splitAmount = Number(tx.amount) * (split.percentage / 100);
            if (split.userId !== tx.paidByUserId) {
              if (tx.paidByUserId === currentUserId) partnerOwesAmount += splitAmount;
              else youOweAmount += splitAmount;
            }
          });

          const splitText = partnerOwesAmount > 0
            ? `R$ ${partnerOwesAmount.toFixed(2)} de ${partnerFirstName}`
            : `R$ ${youOweAmount.toFixed(2)} de você`;
          const splitClass = partnerOwesAmount > 0
            ? 'couple-expense-split'
            : 'couple-expense-split couple-expense-split--owe';

          return (
            <div key={tx.id} className="couple-expense-item">
              <div className="couple-expense-left">
                <div className={`couple-expense-icon ${getCategoryIconClass(tx.category)}`}>
                  {getCategoryIcon(tx.category)}
                </div>
                <div>
                  <p className="couple-expense-name">{tx.name}</p>
                  <p className="couple-expense-meta">
                    Pago por {paidLabel} •{' '}
                    {new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </div>
              <div className="couple-expense-right">
                <p className="couple-expense-total">
                  R$ {Number(tx.amount).toFixed(2)}
                </p>
                {(partnerOwesAmount > 0 || youOweAmount > 0) && (
                  <p className={splitClass}>{splitText}</p>
                )}
              </div>
            </div>
          );
        })}

        {(!transactions?.items || transactions.items.length === 0) && (
          <p className="couple-empty-text">Nenhuma despesa compartilhada ainda.</p>
        )}
      </div>
    </div>
  );
}
