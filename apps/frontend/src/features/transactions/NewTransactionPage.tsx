import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
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

  const getNavItemClass = (path: string) => {
    return `nav-item ${location.pathname === path ? "nav-item--active" : ""}`;
  };

  if (isLoading) {
    return <div className="loading-state">Loading…</div>;
  }

  if (!hasToken || !user) {
    return <div className="loading-state">Redirecting to login...</div>;
  }

  const userInitial = user.email.slice(0, 1).toUpperCase();

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
      </main>
    </div>
  );
}
