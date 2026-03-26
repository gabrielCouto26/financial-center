import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../services/api';
import type { CoupleSummary } from '../../types/couple';
import {
  Category,
  type Transaction,
  TransactionType,
} from '../../types/transaction';

type Props = {
  currentUserId: string;
};

export function TransactionList({ currentUserId }: Props) {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', currentUserId],
    queryFn: () => apiFetch<Transaction[]>('/transactions'),
  });
  const { data: couple } = useQuery({
    queryKey: ['couple', currentUserId],
    queryFn: () => apiFetch<CoupleSummary | null>('/couple'),
  });

  const partnerId = couple?.partner?.id;
  const partnerEmail = couple?.partner?.email;

  const categoryLabels: Record<Category, string> = {
    [Category.FOOD]: 'Food',
    [Category.TRANSPORT]: 'Transport',
    [Category.HOUSING]: 'Housing',
    [Category.ENTERTAINMENT]: 'Entertainment',
    [Category.HEALTH]: 'Health',
    [Category.SHOPPING]: 'Shopping',
    [Category.EDUCATION]: 'Education',
    [Category.UTILITIES]: 'Utilities',
    [Category.OTHER]: 'Other',
  };

  if (isLoading) {
    return <p>Loading transactions…</p>;
  }

  if (!transactions || transactions.length === 0) {
    return <p>No transactions yet.</p>;
  }

  return (
    <section>
      <h2>Your Transactions</h2>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Type</th>
            <th>Category</th>
            <th>Split</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t: Transaction) => (
            <tr key={t.id}>
              <td>{new Date(t.date).toLocaleDateString()}</td>
              <td>{t.name}</td>
              <td>
                <span className={t.type === TransactionType.COUPLE ? 'pill pill-couple' : 'pill'}>
                  {t.type === TransactionType.COUPLE ? 'Couple' : 'Personal'}
                </span>
              </td>
              <td>{categoryLabels[t.category]}</td>
              <td>
                {t.type === TransactionType.COUPLE
                  ? t.splits
                      .map((split) => {
                        const label =
                          split.userId === partnerId && partnerEmail
                            ? partnerEmail
                            : 'You';
                        return `${label}: ${split.percentage}%`;
                      })
                      .join(' · ')
                  : 'Self'}
              </td>
              <td className="amount">
                ${Number(t.amount).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
