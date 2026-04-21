import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../services/api";
import type { CoupleSummary } from "../../types/couple";
import type { GroupSummary } from "../../types/group";
import {
  Category,
  type PaginatedTransactions,
  type Transaction,
  TransactionType,
} from "../../types/transaction";

type Props = {
  currentUserId: string;
};

export function TransactionList({ currentUserId }: Props) {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", currentUserId],
    queryFn: () => apiFetch<PaginatedTransactions>("/transactions"),
  });
  const { data: couple } = useQuery({
    queryKey: ["couple", currentUserId],
    queryFn: () => apiFetch<CoupleSummary | null>("/couple"),
  });
  const { data: groups } = useQuery({
    queryKey: ["groups", currentUserId],
    queryFn: () => apiFetch<GroupSummary[]>("/groups"),
  });

  const categoryLabels: Record<Category, string> = {
    [Category.FOOD]: "Food",
    [Category.TRANSPORT]: "Transport",
    [Category.HOUSING]: "Housing",
    [Category.ENTERTAINMENT]: "Entertainment",
    [Category.HEALTH]: "Health",
    [Category.SHOPPING]: "Shopping",
    [Category.EDUCATION]: "Education",
    [Category.UTILITIES]: "Utilities",
    [Category.OTHER]: "Other",
  };

  function formatSplit(transaction: Transaction): string {
    if (transaction.type === TransactionType.PERSONAL) {
      return "Self";
    }

    if (transaction.type === TransactionType.COUPLE) {
      return transaction.splits
        .map((split) => {
          const label =
            split.userId === couple?.partner?.id && couple?.partner?.email
              ? couple.partner.name ?? couple.partner.email
              : "You";
          return `${label}: ${split.percentage}%`;
        })
        .join(" · ");
    }

    const group = groups?.find((item) => item.id === transaction.group?.id);
    return `${group?.name ?? transaction.group?.name ?? "Group"} · ${transaction.splits.length} participants`;
  }

  function pillLabel(type: TransactionType): string {
    switch (type) {
      case TransactionType.COUPLE:
        return "Couple";
      case TransactionType.GROUP:
        return "Group";
      default:
        return "Personal";
    }
  }

  if (isLoading) {
    return <p>Loading transactions…</p>;
  }

  if (!transactions || transactions.items.length === 0) {
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
          {transactions.items.map((transaction) => (
            <tr key={transaction.id}>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.name}</td>
              <td>
                <span
                  className={
                    transaction.type === TransactionType.COUPLE
                      ? "pill pill-couple"
                      : transaction.type === TransactionType.GROUP
                        ? "pill pill-group"
                        : "pill"
                  }
                >
                  {pillLabel(transaction.type)}
                </span>
              </td>
              <td>{categoryLabels[transaction.category]}</td>
              <td>{formatSplit(transaction)}</td>
              <td className="amount">
                ${Number(transaction.amount).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
