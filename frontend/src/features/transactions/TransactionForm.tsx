import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiFetch } from '../../services/api';
import { Category, type Transaction } from '../../types/transaction';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.number().positive('Amount must be positive'),
  category: z.nativeEnum(Category),
  date: z.string().min(1, 'Date is required'),
});

type FormValues = z.infer<typeof schema>;

export function TransactionForm() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      apiFetch<Transaction>('/transactions', {
        method: 'POST',
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['transactions'] });
      reset();
    },
  });

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
          {...register('amount', { valueAsNumber: true })}
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

      {mutation.isError && (
        <p className="error">{mutation.error.message}</p>
      )}

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving…' : 'Add Transaction'}
      </button>
    </form>
  );
}
