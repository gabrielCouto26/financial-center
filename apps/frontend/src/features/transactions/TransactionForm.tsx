import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
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
import type { CoupleSummary } from "../../types/couple";
import type { GroupDetail, GroupSummary } from "../../types/group";
import {
  Category,
  type CreateTransactionRequest,
  TransactionDirection,
  type Transaction,
  TransactionType,
} from "../../types/transaction";
import type { SafeUser } from "../../types/user";
import "./TransactionForm.css";

const splitSchema = z.object({
  userId: z.string().uuid(),
  percentage: z.coerce.number().positive("Percentage must be positive"),
});

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    amount: z.coerce.number().positive("Amount must be positive"),
    category: z.nativeEnum(Category),
    date: z.string().min(1, "Date is required"),
    type: z.nativeEnum(TransactionType),
    direction: z.nativeEnum(TransactionDirection),
    paidByUserId: z.string().optional(),
    groupId: z.string().optional(),
    participantUserIds: z.array(z.string()).optional(),
    splits: z.array(splitSchema).optional(),
  })
  .superRefine((values, ctx) => {
    if (values.type === TransactionType.PERSONAL) {
      return;
    }

    if (!values.paidByUserId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Payer is required",
        path: ["paidByUserId"],
      });
    }

    if (values.type === TransactionType.COUPLE) {
      if (values.groupId || values.participantUserIds) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Couple transactions cannot include group fields",
          path: ["groupId"],
        });
      }
      if (values.splits && values.splits.length !== 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Custom couple splits require two participants",
          path: ["splits"],
        });
      }
    }

    if (values.type === TransactionType.GROUP) {
      if (!values.groupId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Group is required",
          path: ["groupId"],
        });
      }
      if (values.participantUserIds && values.splits) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Choose selected members or custom split, not both",
          path: ["participantUserIds"],
        });
      }
      if (values.participantUserIds && values.participantUserIds.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select at least two participants",
          path: ["participantUserIds"],
        });
      }
    }

    if (values.splits) {
      const total = values.splits.reduce(
        (sum, split) => sum + split.percentage,
        0,
      );
      if (Math.abs(total - 100) > 0.001) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Split percentages must total 100",
          path: ["splits"],
        });
      }
    }
  });

type FormValues = z.infer<typeof schema>;

type Props = {
  user?: SafeUser;
  isLoading?: boolean;
  hasToken?: boolean;
};

type SplitMode = "default" | "subset" | "custom";

export function TransactionForm({ user, isLoading, hasToken }: Props) {
  const currentUserId = user?.id ?? "";
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { data: couple } = useQuery({
    queryKey: ["couple", currentUserId],
    queryFn: () => apiFetch<CoupleSummary | null>("/couple"),
  });
  const { data: groups } = useQuery({
    queryKey: ["groups", currentUserId],
    queryFn: () => apiFetch<GroupSummary[]>("/groups"),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      direction: TransactionDirection.EXPENSE,
      type: TransactionType.PERSONAL,
    },
  });

  const amount = watch("amount");
  const type = watch("type");
  const groupId = watch("groupId");
  const paidByUserId = watch("paidByUserId");
  const participantUserIds = watch("participantUserIds");
  const splits = watch("splits");
  const categoryValue = watch("category");
  const splitMode: SplitMode = splits
    ? "custom"
    : participantUserIds && participantUserIds.length > 0
      ? "subset"
      : "default";
  const selectedGroupId = groupId || groups?.[0]?.id || "";
  const { data: selectedGroup } = useQuery({
    queryKey: ["group-detail", currentUserId, selectedGroupId],
    queryFn: () => apiFetch<GroupDetail>(`/groups/${selectedGroupId}`),
    enabled: Boolean(selectedGroupId),
  });

  const coupleMembers = Array.isArray(couple?.members) ? couple.members : [];
  const groupMembers = useMemo(
    () =>
      Array.isArray(selectedGroup?.members) ? selectedGroup.members : [],
    [selectedGroup?.members],
  );

  useEffect(() => {
    if (type === TransactionType.PERSONAL) {
      setValue("paidByUserId", undefined);
      setValue("groupId", undefined);
      setValue("participantUserIds", undefined);
      setValue("splits", undefined);
      return;
    }

    if (type === TransactionType.COUPLE) {
      setValue("groupId", undefined);
      setValue("participantUserIds", undefined);
      if (!paidByUserId) {
        setValue("paidByUserId", currentUserId);
      }
      return;
    }

    if (type === TransactionType.GROUP) {
      if (!groupId && groups?.[0]?.id) {
        setValue("groupId", groups[0].id);
      }
      if (!paidByUserId) {
        setValue("paidByUserId", currentUserId);
      }
    }
  }, [currentUserId, groupId, groups, paidByUserId, setValue, type]);

  useEffect(() => {
    if (type !== TransactionType.GROUP) {
      return;
    }

    if (
      paidByUserId &&
      groupMembers.length > 0 &&
      !groupMembers.some((member) => member.id === paidByUserId)
    ) {
      setValue("paidByUserId", currentUserId);
    }
  }, [currentUserId, groupMembers, paidByUserId, setValue, type]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      apiFetch<Transaction>("/transactions", {
        method: "POST",
        body: JSON.stringify(toRequest(values)),
      }),
    onSuccess: () => {
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
      if (selectedGroupId) {
        void queryClient.invalidateQueries({
          queryKey: ["group-balance", currentUserId, selectedGroupId],
        });
      }
      navigate(-1);
    },
  });

  function toRequest(values: FormValues): CreateTransactionRequest {
    if (values.type === TransactionType.PERSONAL) {
      return {
        name: values.name,
        amount: values.amount,
        category: values.category,
        date: values.date,
        type: TransactionType.PERSONAL,
        direction: values.direction,
      };
    }

    if (values.type === TransactionType.COUPLE) {
      return {
        name: values.name,
        amount: values.amount,
        category: values.category,
        date: values.date,
        type: TransactionType.COUPLE,
        direction: values.direction,
        paidByUserId: values.paidByUserId,
        splits: values.splits,
      };
    }

    return {
      name: values.name,
      amount: values.amount,
      category: values.category,
      date: values.date,
      type: TransactionType.GROUP,
      direction: values.direction,
      groupId: values.groupId,
      paidByUserId: values.paidByUserId,
      participantUserIds: values.participantUserIds?.length
        ? values.participantUserIds
        : undefined,
      splits: values.splits,
    };
  }

  function setDefaultMode() {
    setValue("participantUserIds", undefined);
    setValue("splits", undefined);
  }

  function setSubsetMode() {
    setValue("splits", undefined);
    setValue(
      "participantUserIds",
      groupMembers
        .slice(0, Math.max(2, groupMembers.length))
        .map((member) => member.id),
    );
  }

  function setCustomModeForCouple() {
    setValue("participantUserIds", undefined);
    setValue(
      "splits",
      createEqualSplits(coupleMembers.map((member) => member.id)),
    );
  }

  function createEqualSplits(userIds: string[]) {
    if (userIds.length === 0) {
      return [];
    }

    const base = Math.floor(10000 / userIds.length) / 100;
    const equalSplits = userIds.map((userId) => ({
      userId,
      percentage: base,
    }));
    const total = equalSplits.reduce((sum, split) => sum + split.percentage, 0);
    equalSplits[equalSplits.length - 1].percentage =
      Math.round(
        (equalSplits[equalSplits.length - 1].percentage + (100 - total)) * 100,
      ) / 100;

    return equalSplits;
  }

  const categoryLabels: Record<Category, string> = {
    [Category.FOOD]: "Food",
    [Category.TRANSPORT]: "Transport",
    [Category.HOUSING]: "Housing",
    [Category.ENTERTAINMENT]: "Leisure",
    [Category.HEALTH]: "Health",
    [Category.SHOPPING]: "Shopping",
    [Category.EDUCATION]: "Education",
    [Category.UTILITIES]: "Utilities",
    [Category.OTHER]: "Other",
  };

  const getNavItemClass = (path: string) => {
    return `nav-item ${location.pathname === path ? "nav-item--active" : ""}`;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
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

          <form
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            className="transaction-form-grid"
          >
            {/* Main Content Area */}
            <div className="transaction-form-main">
              <div className="form-card">
                <div className="flex flex-col gap-8">
                  {/* Transaction Name */}
                  <div
                    className={`input-group ${errors.name ? "field-error" : ""}`}
                  >
                    <label>Transaction Name</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Weekly Groceries"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="error-text">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Amount and Date Row */}
                  <div className="form-row">
                    <div
                      className={`input-group ${errors.amount ? "field-error" : ""}`}
                    >
                      <label>Amount</label>
                      <div className="amount-input-container">
                        <span className="currency-prefix">R$</span>
                        <input
                          type="number"
                          step="0.01"
                          className="input-field amount-input"
                          placeholder="0,00"
                          {...register("amount")}
                        />
                      </div>
                      {errors.amount && (
                        <p className="error-text">{errors.amount.message}</p>
                      )}
                    </div>

                    <div
                      className={`input-group ${errors.date ? "field-error" : ""}`}
                    >
                      <label>Date</label>
                      <div className="date-input-container">
                        <input
                          type="date"
                          className="input-field"
                          {...register("date")}
                        />
                        <span className="material-symbols-outlined calendar-icon">
                          calendar_today
                        </span>
                      </div>
                      {errors.date && (
                        <p className="error-text">{errors.date.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Type Toggle */}
              <div className="type-toggle">
                <button
                  type="button"
                  className={`type-toggle-btn ${type === TransactionType.PERSONAL ? "active" : ""}`}
                  onClick={() => setValue("type", TransactionType.PERSONAL)}
                >
                  <span className="material-symbols-outlined">person</span>
                  Personal
                </button>
                <button
                  type="button"
                  className={`type-toggle-btn ${type === TransactionType.COUPLE ? "active" : ""}`}
                  disabled={!couple}
                  onClick={() => setValue("type", TransactionType.COUPLE)}
                >
                  <span className="material-symbols-outlined">favorite</span>
                  Couple
                </button>
                <button
                  type="button"
                  className={`type-toggle-btn ${type === TransactionType.GROUP ? "active" : ""}`}
                  disabled={!groups?.length}
                  onClick={() => setValue("type", TransactionType.GROUP)}
                >
                  <span className="material-symbols-outlined">group</span>
                  Groups
                </button>
              </div>

              {/* Split Configuration */}
              {(type === TransactionType.COUPLE ||
                type === TransactionType.GROUP) && (
                <div className="split-config-card">
                  <div className="split-config-header">
                    <h3 className="split-config-title">
                      <span className="material-symbols-outlined">
                        call_split
                      </span>
                      Split Configuration
                    </h3>
                    <div className="split-mode-toggle">
                      <button
                        type="button"
                        className={`split-mode-btn ${splitMode === "default" ? "active" : ""}`}
                        onClick={setDefaultMode}
                      >
                        Equal (50/50)
                      </button>
                      <button
                        type="button"
                        className={`split-mode-btn ${splitMode === "custom" || splitMode === "subset" ? "active" : ""}`}
                        onClick={
                          type === TransactionType.COUPLE
                            ? setCustomModeForCouple
                            : setSubsetMode
                        }
                      >
                        Custom
                      </button>
                    </div>
                  </div>

                  <div className="members-grid">
                    {type === TransactionType.COUPLE &&
                      coupleMembers.map((member) => {
                        const isSelected =
                          splitMode === "default" ||
                          splits?.some((s) => s.userId === member.id);
                        const percentage =
                          splitMode === "default"
                            ? 50
                            : splits?.find((s) => s.userId === member.id)
                                ?.percentage ?? 0;
                        const shareAmount = (amount * percentage) / 100;

                        return (
                          <div
                            key={member.id}
                            className={`member-card ${isSelected ? "selected" : ""}`}
                            onClick={() => {
                              if (splitMode === "custom") {
                                // Toggle logic for custom splits if needed, 
                                // though for couple usually it's both or nothing in equal mode
                                // For now, just display.
                              }
                            }}
                          >
                            <div className="member-avatar" />
                            <div className="member-info">
                              <p className="member-name">
                                {member.id === currentUserId
                                  ? "You"
                                  : couple?.partner.email}
                              </p>
                              <p className="member-share">
                                {formatCurrency(shareAmount)}
                              </p>
                            </div>
                            <span
                              className={`material-symbols-outlined select-icon ${isSelected ? "active" : ""}`}
                              style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}
                            >
                              {isSelected ? "check_circle" : "circle"}
                            </span>
                          </div>
                        );
                      })}

                    {type === TransactionType.GROUP &&
                      groupMembers.map((member) => {
                        const isSelected =
                          splitMode === "default" ||
                          participantUserIds?.includes(member.id) ||
                          splits?.some((s) => s.userId === member.id);

                        let percentage = 0;
                        if (splitMode === "default") {
                          percentage = 100 / (groupMembers.length || 1);
                        } else if (splitMode === "subset") {
                          const count = participantUserIds?.length || 1;
                          percentage = participantUserIds?.includes(member.id)
                            ? 100 / count
                            : 0;
                        } else {
                          percentage =
                            splits?.find((s) => s.userId === member.id)
                              ?.percentage ?? 0;
                        }
                        const shareAmount = (amount * percentage) / 100;

                        return (
                          <div
                            key={member.id}
                            className={`member-card ${isSelected ? "selected" : ""}`}
                            onClick={() => {
                              if (splitMode === "subset") {
                                const current = participantUserIds || [];
                                if (current.includes(member.id)) {
                                  setValue(
                                    "participantUserIds",
                                    current.filter((id) => id !== member.id),
                                  );
                                } else {
                                  setValue("participantUserIds", [
                                    ...current,
                                    member.id,
                                  ]);
                                }
                              }
                            }}
                          >
                            <div className="member-avatar" />
                            <div className="member-info">
                              <p className="member-name">
                                {member.id === currentUserId
                                  ? "You"
                                  : member.email}
                              </p>
                              <p className="member-share">
                                {formatCurrency(shareAmount)}
                              </p>
                            </div>
                            <span
                              className={`material-symbols-outlined select-icon ${isSelected ? "active" : ""}`}
                              style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}
                            >
                              {isSelected ? "check_circle" : "circle"}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Area */}
            <aside className="transaction-form-aside">
              {/* Category Selector */}
              <div className="form-card">
                <label className="block text-sm font-bold text-on-surface-variant mb-6 uppercase tracking-[0.1em]">
                  Category
                </label>
                <div className="category-grid">
                  {Object.values(Category).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`category-btn ${categoryValue === cat ? "active" : ""}`}
                      onClick={() => setValue("category", cat)}
                    >
                      <div className="category-icon-wrapper">
                        <span className="material-symbols-outlined">
                          {getCategoryIcon(cat)}
                        </span>
                      </div>
                      <span className="label">{categoryLabels[cat]}</span>
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="error-text">{errors.category.message}</p>
                )}
              </div>

              {/* Paid By & Direction */}
              <div className="form-card">
                <div className="space-y-6">
                  <div className="input-group">
                    <label className="tracking-[0.1em]">Who Paid</label>
                    <select
                      className="input-field"
                      {...register("paidByUserId")}
                    >
                      {type === TransactionType.PERSONAL ? (
                        <option value={currentUserId}>Me</option>
                      ) : type === TransactionType.COUPLE ? (
                        coupleMembers.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.id === currentUserId
                              ? "Me"
                              : couple?.partner.email}
                          </option>
                        ))
                      ) : (
                        groupMembers.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.id === currentUserId ? "Me" : member.email}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Type</label>
                    <select className="input-field" {...register("direction")}>
                      <option value={TransactionDirection.EXPENSE}>
                        Expense
                      </option>
                      <option value={TransactionDirection.INCOME}>
                        Income
                      </option>
                    </select>
                  </div>

                  {type === TransactionType.GROUP && (
                    <div className="input-group">
                      <label>Group</label>
                      <select className="input-field" {...register("groupId")}>
                        {groups?.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Saving..." : "Save Expense"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>
            </aside>

            {/* Global Errors */}
            <div className="col-span-12">
              {errors.paidByUserId && (
                <p className="error-text">{errors.paidByUserId.message}</p>
              )}
              {errors.groupId && (
                <p className="error-text">{errors.groupId.message}</p>
              )}
              {errors.participantUserIds && (
                <p className="error-text">
                  {"message" in errors.participantUserIds
                    ? (errors.participantUserIds.message as string)
                    : "Select the group participants."}
                </p>
              )}
              {errors.splits && (
                <p className="error-text">
                  {"message" in errors.splits
                    ? (errors.splits.message as string)
                    : "Review split values."}
                </p>
              )}
              {mutation.isError && (
                <p className="error-text">{mutation.error.message}</p>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function getCategoryIcon(category: Category): string {
  switch (category) {
    case Category.FOOD:
      return "restaurant";
    case Category.TRANSPORT:
      return "directions_car";
    case Category.HOUSING:
      return "home";
    case Category.ENTERTAINMENT:
      return "sports_esports";
    case Category.HEALTH:
      return "health_and_safety";
    case Category.SHOPPING:
      return "shopping_bag";
    case Category.EDUCATION:
      return "school";
    case Category.UTILITIES:
      return "bolt";
    case Category.OTHER:
      return "more_horiz";
    default:
      return "category";
  }
}
