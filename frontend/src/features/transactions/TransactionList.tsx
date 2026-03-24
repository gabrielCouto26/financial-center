import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../services/api';
import { Category, type Transaction } from '../../types/transaction';

export function TransactionList() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => apiFetch<Transaction[]>('/transactions'),
  });

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
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t: Transaction) => (
            <tr key={t.id}>
              <td>{new Date(t.date).toLocaleDateString()}</td>
              <td>{t.name}</td>
              <td>{categoryLabels[t.category]}</td>
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
