import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layout/DashboardLayout";
import { apiFetch } from "../../services/api";
import { TransactionForm } from "./TransactionForm";
import type { CreateTransactionRequest, Transaction } from "../../types/transaction";
import type { SafeUser } from "../../types/user";
import "./NewTransactionPage.css";

type Props = {
  user?: SafeUser;
  isLoading?: boolean;
  hasToken?: boolean;
};

export function NewTransactionPage({ user, isLoading, hasToken }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: CreateTransactionRequest) =>
      apiFetch<Transaction>("/transactions", {
        method: "POST",
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      const currentUserId = user?.id;
      if (currentUserId) {
        void queryClient.invalidateQueries({
          queryKey: ["transactions", currentUserId],
        });
        void queryClient.invalidateQueries({
          queryKey: ["dashboard", currentUserId],
        });
        void queryClient.invalidateQueries({
          queryKey: ["couple-balance", currentUserId],
        });
        void queryClient.invalidateQueries({
          queryKey: ["groups", currentUserId],
        });
      }
      navigate(-1);
    },
  });

  if (isLoading) {
    return <div className="loading-state">Loading…</div>;
  }

  if (!hasToken || !user) {
    return <div className="loading-state">Redirecting to login...</div>;
  }

  return (
    <DashboardLayout user={user} activePath="/dashboard">
      <div className="transaction-form-content">
          <header className="transaction-form-header">
            <span className="entry-creation">Entry Creation</span>
            <h1>
              Record an <span className="highlight">Expense</span>
            </h1>
            <p>
              Log your latest transaction into the digital ledger. Your editorial
              clarity begins with precise documentation.
            </p>
          </header>

        <TransactionForm
          user={user}
          onSubmit={(values) => mutation.mutate(values)}
          isPending={mutation.isPending}
          submitLabel="Save Expense"
        />
      </div>
    </DashboardLayout>
  );
}
