import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../layout/DashboardLayout";
import { AuthenticatedPage } from "../../layout/AuthenticatedPage";
import { apiFetch } from "../../services/api";
import { TransactionForm } from "./TransactionForm";
import type { TransactionFormValues } from "./transactionFormSchema";
import type { CreateTransactionRequest, Transaction } from "../../types/transaction";
import type { SafeUser } from "../../types/user";
import "./NewTransactionPage.css";

type Props = {
  user?: SafeUser;
  isLoading?: boolean;
  hasToken?: boolean;
};

export function EditTransactionPage({ user, isLoading, hasToken }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: transaction, isLoading: isLoadingTransaction } = useQuery({
    queryKey: ["transaction", id],
    queryFn: () => apiFetch<Transaction>(`/transactions/${id}`),
    enabled: Boolean(id),
  });

  const mutation = useMutation({
    mutationFn: (values: CreateTransactionRequest) =>
      apiFetch<Transaction>(`/transactions/${id}`, {
        method: "PUT",
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

  if (isLoading || isLoadingTransaction) {
    return <div className="loading-state">Carregando transação…</div>;
  }

  if (!hasToken || !user) {
    return <div className="loading-state">Redirecionando para o login…</div>;
  }

  const initialValues: Partial<TransactionFormValues> | undefined = transaction
    ? {
        name: transaction.name,
        amount: Number(transaction.amount),
        category: transaction.category,
        date: transaction.date ? new Date(transaction.date).toISOString().split("T")[0] : "",
        type: transaction.type,
        direction: transaction.direction,
        paidByUserId: transaction.paidByUserId,
        groupId: transaction.group?.id,
        splits:
          transaction.splits.length > 0 ? transaction.splits : undefined,
      }
    : undefined;

  return (
    <DashboardLayout user={user} activePath="/dashboard">
      <AuthenticatedPage
        className="transaction-page"
        width="narrow"
        eyebrow="Editar transação"
        title={
          <>
            Atualizar <span className="transaction-page-title-highlight">transação</span>
          </>
        }
        description="Revise os dados abaixo para corrigir ou atualizar esta movimentação financeira."
      >
        {transaction && (
          <TransactionForm
            user={user}
            initialValues={initialValues}
            onSubmit={(values) => mutation.mutate(values)}
            isPending={mutation.isPending}
            submitLabel="Atualizar transação"
          />
        )}
      </AuthenticatedPage>
    </DashboardLayout>
  );
}
