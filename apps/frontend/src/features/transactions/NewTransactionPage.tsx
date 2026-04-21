import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layout/DashboardLayout";
import { AuthenticatedPage } from "../../layout/AuthenticatedPage";
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
    return <div className="loading-state">Carregando formulário…</div>;
  }

  if (!hasToken || !user) {
    return <div className="loading-state">Redirecionando para o login…</div>;
  }

  return (
    <DashboardLayout user={user} activePath="/dashboard">
      <AuthenticatedPage
        className="transaction-page"
        width="narrow"
        eyebrow="Nova transação"
        title={
          <>
            Registrar <span className="transaction-page-title-highlight">transação</span>
          </>
        }
        description="Preencha os detalhes abaixo para adicionar uma nova movimentação ao seu histórico financeiro."
      >
        <TransactionForm
          user={user}
          onSubmit={(values) => mutation.mutate(values)}
          isPending={mutation.isPending}
          submitLabel="Salvar transação"
        />
      </AuthenticatedPage>
    </DashboardLayout>
  );
}
