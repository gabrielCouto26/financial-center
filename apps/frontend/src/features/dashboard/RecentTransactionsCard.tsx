import { Category, type Transaction, TransactionType } from '../../types/transaction';

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

type Props = {
  transactions: Transaction[];
};

export function RecentTransactionsCard({ transactions }: Props) {
  return (
    <section className="panel">
      <h2>Recent Transactions</h2>
      {transactions.length === 0 ? (
        <p className="hint">No recent transactions yet.</p>
      ) : (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.name}</td>
                <td>
                  <span
                    className={
                      transaction.type === TransactionType.COUPLE
                        ? 'pill pill-couple'
                        : transaction.type === TransactionType.GROUP
                          ? 'pill pill-group'
                          : 'pill'
                    }
                  >
                    {transaction.type === TransactionType.PERSONAL
                      ? 'Personal'
                      : transaction.type === TransactionType.COUPLE
                        ? 'Couple'
                        : 'Group'}
                  </span>
                </td>
                <td>{categoryLabels[transaction.category]}</td>
                <td className="amount">${Number(transaction.amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
