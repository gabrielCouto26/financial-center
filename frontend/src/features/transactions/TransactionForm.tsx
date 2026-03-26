import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiFetch } from '../../services/api';
import type { CoupleSummary } from '../../types/couple';
import {
  Category,
  type CreateTransactionRequest,
  type Transaction,
  TransactionType,
} from '../../types/transaction';

const splitSchema = z.object({
  userId: z.string().uuid(),
  percentage: z.coerce.number().positive('Percentage must be positive'),
});

const schema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    amount: z.coerce.number().positive('Amount must be positive'),
    category: z.nativeEnum(Category),
    date: z.string().min(1, 'Date is required'),
    type: z.nativeEnum(TransactionType),
    paidByUserId: z.string().optional(),
    splits: z.array(splitSchema).optional(),
  })
  .superRefine((values, ctx) => {
    if (values.type === TransactionType.PERSONAL) {
      return;
    }

    if (!values.paidByUserId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Payer is required for couple transactions',
        path: ['paidByUserId'],
      });
    }

    if (!values.splits) {
      return;
    }

    if (values.splits.length !== 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom splits require two participants',
        path: ['splits'],
      });
      return;
    }

    const total = values.splits.reduce((sum, split) => sum + split.percentage, 0);
    if (Math.abs(total - 100) > 0.001) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Split percentages must total 100',
        path: ['splits'],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

type Props = {
  currentUserId: string;
};

export function TransactionForm({ currentUserId }: Props) {
  const queryClient = useQueryClient();
  const { data: couple } = useQuery({
    queryKey: ['couple', currentUserId],
    queryFn: () => apiFetch<CoupleSummary | null>('/couple'),
  });
  const coupleMembers = Array.isArray(couple?.members) ? couple.members : [];
  const memberIds = coupleMembers.map((member) => member.id);

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
      date: new Date().toISOString().split('T')[0],
      type: TransactionType.PERSONAL,
    },
  });

  const transactionType = watch('type');
  const watchedPaidByUserId = watch('paidByUserId');
  const useCustomSplits = watch('splits') !== undefined;

  useEffect(() => {
    if (transactionType === TransactionType.PERSONAL) {
      setValue('paidByUserId', undefined);
      setValue('splits', undefined);
      return;
    }

    if (!couple) {
      return;
    }

    if (!watchedPaidByUserId) {
      setValue('paidByUserId', currentUserId);
    }
  }, [couple, currentUserId, setValue, transactionType, watchedPaidByUserId]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      apiFetch<Transaction>('/transactions', {
        method: 'POST',
        body: JSON.stringify(thisRequest(values)),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['transactions', currentUserId] });
      void queryClient.invalidateQueries({ queryKey: ['couple-balance', currentUserId] });
      reset({
        date: new Date().toISOString().split('T')[0],
        type: TransactionType.PERSONAL,
      });
    },
  });

  function thisRequest(values: FormValues): CreateTransactionRequest {
    if (values.type === TransactionType.PERSONAL) {
      return {
        name: values.name,
        amount: values.amount,
        category: values.category,
        date: values.date,
        type: TransactionType.PERSONAL,
      };
    }

    return {
      name: values.name,
      amount: values.amount,
      category: values.category,
      date: values.date,
      type: TransactionType.COUPLE,
      paidByUserId: values.paidByUserId,
      splits: values.splits,
    };
  }

  function enableDefaultSplit() {
    setValue('splits', undefined);
  }

  function enableCustomSplit() {
    if (!couple) {
      return;
    }
    setValue(
      'splits',
      coupleMembers.map((member, index) => ({
        userId: member.id,
        percentage: index === 0 ? 50 : 50,
      })),
    );
  }

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

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="form"
    >
      <h2>Add Transaction</h2>

      <label>
        Name
        <input type="text" {...register('name')} />
      </label>
      {errors.name && <p className="error">{errors.name.message}</p>}

      <label>
        Amount
        <input
          type="number"
          step="0.01"
          {...register('amount')}
        />
      </label>
      {errors.amount && <p className="error">{errors.amount.message}</p>}

      <label>
        Category
        <select {...register('category')}>
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
        <input type="date" {...register('date')} />
      </label>
      {errors.date && <p className="error">{errors.date.message}</p>}

      <label>
        Type
        <select {...register('type')}>
          <option value={TransactionType.PERSONAL}>Personal</option>
          <option value={TransactionType.COUPLE} disabled={!couple}>
            Couple
          </option>
        </select>
      </label>

      {transactionType === TransactionType.COUPLE && (
        <>
          {!couple && (
            <p className="hint">Link a partner before adding couple expenses.</p>
          )}

          {couple && (
            <>
              <label>
                Paid by
                <select {...register('paidByUserId')}>
                  {coupleMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.id === currentUserId ? 'You' : couple.partner.email}
                    </option>
                  ))}
                </select>
              </label>
              {errors.paidByUserId && (
                <p className="error">{errors.paidByUserId.message}</p>
              )}

              <div className="split-toggle">
                <button
                  type="button"
                  className={!useCustomSplits ? 'secondary-button active' : 'secondary-button'}
                  onClick={enableDefaultSplit}
                >
                  50/50 Split
                </button>
                <button
                  type="button"
                  className={useCustomSplits ? 'secondary-button active' : 'secondary-button'}
                  onClick={enableCustomSplit}
                >
                  Custom Split
                </button>
              </div>

              {useCustomSplits &&
                memberIds.map((memberId, index) => (
                  <label key={memberId}>
                    {memberId === currentUserId ? 'Your share (%)' : `${couple.partner.email} share (%)`}
                    <input
                      type="number"
                      step="0.01"
                      {...register(`splits.${index}.percentage` as const)}
                    />
                    <input
                      type="hidden"
                      {...register(`splits.${index}.userId` as const)}
                      value={memberId}
                    />
                  </label>
                ))}
              {errors.splits && (
                <p className="error">
                  {'message' in errors.splits
                    ? errors.splits.message
                    : 'Review the split percentages.'}
                </p>
              )}
            </>
          )}
        </>
      )}

      {mutation.isError && <p className="error">{mutation.error.message}</p>}

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving…' : 'Add Transaction'}
      </button>
    </form>
  );
}
