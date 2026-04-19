import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../design-system/Button/Button";
import { Input } from "../../design-system/Input/Input";
import {
  IconDashboard,
  IconUser,
  IconHeart,
  IconUsers,
  IconSearch,
  IconBell,
  IconSettings,
  IconPlus,
} from "../../design-system/Icons";
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
  const location = useLocation();
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

  const getNavItemClass = (path: string) => {
    return `nav-item ${location.pathname === path ? "nav-item--active" : ""}`;
  };

  if (isLoading || isLoadingTransaction) {
    return <div className="loading-state">Loading…</div>;
  }

  if (!hasToken || !user) {
    return <div className="loading-state">Redirecting to login...</div>;
  }

  const userInitial = user.email.slice(0, 1).toUpperCase();

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
    <div className="transaction-form-page">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>Financial Center</h1>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className={getNavItemClass("/dashboard")}>
            <IconDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/personal" className={getNavItemClass("/personal")}>
            <IconUser size={20} />
            Personal
          </Link>
          <span className="nav-item nav-item--disabled" aria-disabled="true">
            <IconHeart size={20} />
            Couple
          </span>
          <span className="nav-item nav-item--disabled" aria-disabled="true">
            <IconUsers size={20} />
            Groups
          </span>
        </nav>

        <div className="sidebar-footer">
          <Button
            variant="primary"
            size="md"
            icon={<IconPlus size={16} />}
            className="w-full"
            disabled
          >
            New Expense
          </Button>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-search">
            <IconSearch size={18} className="search-icon" />
            <Input
              variant="underlined"
              placeholder="Search..."
              className="search-input"
              disabled
            />
          </div>
          <div className="header-actions">
            <IconBell size={20} className="action-icon" />
            <IconSettings size={20} className="action-icon" />
            <div className="user-profile">
              <span className="user-avatar-fallback">{userInitial}</span>
            </div>
          </div>
        </header>

        <div className="transaction-form-content">
          <header className="transaction-form-header">
            <span className="entry-creation">Entry Edition</span>
            <h1>
              Edit <span className="highlight">Expense</span>
            </h1>
            <p>
              Update your transaction in the digital ledger. Your editorial
              clarity continues with precise adjustments.
            </p>
          </header>

          {transaction && (
            <TransactionForm
              user={user}
              initialValues={initialValues}
              onSubmit={(values) => mutation.mutate(values)}
              isPending={mutation.isPending}
              submitLabel="Update Expense"
            />
          )}
        </div>
      </main>
    </div>
  );
}
