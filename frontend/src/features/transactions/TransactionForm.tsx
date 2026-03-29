import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  currentUserId: string;
};

type SplitMode = "default" | "subset" | "custom";

export function TransactionForm({ currentUserId }: Props) {
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
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      direction: TransactionDirection.EXPENSE,
      type: TransactionType.PERSONAL,
    },
  });

  const type = watch("type");
  const groupId = watch("groupId");
  const paidByUserId = watch("paidByUserId");
  const participantUserIds = watch("participantUserIds");
  const splits = watch("splits");
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
      reset({
        date: new Date().toISOString().split("T")[0],
        direction: TransactionDirection.EXPENSE,
        type: TransactionType.PERSONAL,
      });
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

  function setCustomModeForGroup() {
    setValue("participantUserIds", undefined);
    setValue(
      "splits",
      createEqualSplits(groupMembers.map((member) => member.id)),
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
    [Category.ENTERTAINMENT]: "Entertainment",
    [Category.HEALTH]: "Health",
    [Category.SHOPPING]: "Shopping",
    [Category.EDUCATION]: "Education",
    [Category.UTILITIES]: "Utilities",
    [Category.OTHER]: "Other",
  };

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="form"
    >
      <h2>Add Transaction</h2>

      <label>
        Name
        <input type="text" {...register("name")} />
      </label>
      {errors.name && <p className="error">{errors.name.message}</p>}

      <label>
        Amount
        <input type="number" step="0.01" {...register("amount")} />
      </label>
      {errors.amount && <p className="error">{errors.amount.message}</p>}

      <label>
        Category
        <select {...register("category")}>
          {Object.values(Category).map((cat) => (
            <option key={cat} value={cat}>
              {categoryLabels[cat]}
            </option>
          ))}
        </select>
      </label>
      {errors.category && <p className="error">{errors.category.message}</p>}

      <label>
        Date
        <input type="date" {...register("date")} />
      </label>
      {errors.date && <p className="error">{errors.date.message}</p>}

      <label>
        Type
        <select {...register("type")}>
          <option value={TransactionType.PERSONAL}>Personal</option>
          <option value={TransactionType.COUPLE} disabled={!couple}>
            Couple
          </option>
          <option value={TransactionType.GROUP} disabled={!groups?.length}>
            Group
          </option>
        </select>
      </label>

      <label>
        Direction
        <select {...register("direction")}>
          <option value={TransactionDirection.EXPENSE}>Expense</option>
          <option value={TransactionDirection.INCOME}>Income</option>
        </select>
      </label>

      {type === TransactionType.COUPLE && (
        <>
          {!couple ? (
            <p className="hint">
              Link a partner before adding couple expenses.
            </p>
          ) : (
            <>
              <label>
                Paid by
                <select {...register("paidByUserId")}>
                  {coupleMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.id === currentUserId
                        ? "You"
                        : couple.partner.email}
                    </option>
                  ))}
                </select>
              </label>
              <div className="split-toggle">
                <button
                  type="button"
                  className={
                    splitMode === "default"
                      ? "secondary-button active"
                      : "secondary-button"
                  }
                  onClick={setDefaultMode}
                >
                  50/50 Split
                </button>
                <button
                  type="button"
                  className={
                    splitMode === "custom"
                      ? "secondary-button active"
                      : "secondary-button"
                  }
                  onClick={setCustomModeForCouple}
                >
                  Custom Split
                </button>
              </div>
              {splits?.map((split, index) => {
                const label =
                  split.userId === currentUserId
                    ? "Your share (%)"
                    : `${couple.partner.email} share (%)`;
                return (
                  <label key={`${split.userId}-${index}`}>
                    {label}
                    <input
                      type="number"
                      step="0.01"
                      {...register(`splits.${index}.percentage` as const)}
                    />
                    <input
                      type="hidden"
                      {...register(`splits.${index}.userId` as const)}
                      value={split.userId}
                    />
                  </label>
                );
              })}
            </>
          )}
        </>
      )}

      {type === TransactionType.GROUP && (
        <>
          {!groups?.length ? (
            <p className="hint">Create a group before adding group expenses.</p>
          ) : (
            <>
              <label>
                Group
                <select {...register("groupId")}>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Paid by
                <select {...register("paidByUserId")}>
                  {groupMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.id === currentUserId ? "You" : member.email}
                    </option>
                  ))}
                </select>
              </label>

              <div className="split-toggle">
                <button
                  type="button"
                  className={
                    splitMode === "default"
                      ? "secondary-button active"
                      : "secondary-button"
                  }
                  onClick={setDefaultMode}
                >
                  All Members
                </button>
                <button
                  type="button"
                  className={
                    splitMode === "subset"
                      ? "secondary-button active"
                      : "secondary-button"
                  }
                  onClick={setSubsetMode}
                >
                  Selected Members
                </button>
                <button
                  type="button"
                  className={
                    splitMode === "custom"
                      ? "secondary-button active"
                      : "secondary-button"
                  }
                  onClick={setCustomModeForGroup}
                >
                  Custom Split
                </button>
              </div>

              {splitMode === "subset" && (
                <fieldset className="checkbox-group">
                  <legend>Participants</legend>
                  {groupMembers.map((member) => (
                    <label key={member.id} className="checkbox-row">
                      <input
                        type="checkbox"
                        value={member.id}
                        {...register("participantUserIds")}
                      />
                      {member.id === currentUserId ? "You" : member.email}
                    </label>
                  ))}
                </fieldset>
              )}

              {splitMode === "custom" &&
                splits?.map((split, index) => {
                  const member = groupMembers.find(
                    (item) => item.id === split.userId,
                  );
                  const label =
                    split.userId === currentUserId
                      ? "You"
                      : (member?.email ?? split.userId);
                  return (
                    <label key={`${split.userId}-${index}`}>
                      {label} share (%)
                      <input
                        type="number"
                        step="0.01"
                        {...register(`splits.${index}.percentage` as const)}
                      />
                      <input
                        type="hidden"
                        {...register(`splits.${index}.userId` as const)}
                        value={split.userId}
                      />
                    </label>
                  );
                })}
            </>
          )}
        </>
      )}

      {errors.paidByUserId && (
        <p className="error">{errors.paidByUserId.message}</p>
      )}
      {errors.groupId && <p className="error">{errors.groupId.message}</p>}
      {errors.participantUserIds && (
        <p className="error">
          {"message" in errors.participantUserIds
            ? errors.participantUserIds.message
            : "Select the group participants."}
        </p>
      )}
      {errors.splits && (
        <p className="error">
          {"message" in errors.splits
            ? errors.splits.message
            : "Review split values."}
        </p>
      )}
      {mutation.isError && <p className="error">{mutation.error.message}</p>}

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving…" : "Add Transaction"}
      </button>
    </form>
  );
}
