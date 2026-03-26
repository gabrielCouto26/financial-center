import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiFetch } from '../../services/api';
import type { CoupleBalance, CoupleSummary } from '../../types/couple';

const schema = z.object({
  partnerEmail: z.string().email('Enter a valid partner email'),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  enabled: boolean;
  currentUserId: string;
};

export function CouplePanel({ enabled, currentUserId }: Props) {
  const queryClient = useQueryClient();
  const { data: couple, isLoading: isCoupleLoading } = useQuery({
    queryKey: ['couple', currentUserId],
    queryFn: () => apiFetch<CoupleSummary | null>('/couple'),
    enabled,
  });
  const partner = couple?.partner;
  const hasValidCouple =
    Boolean(couple?.id) &&
    Boolean(partner?.id) &&
    Boolean(partner?.email) &&
    Array.isArray(couple?.members);
  const { data: balance, isLoading: isBalanceLoading } = useQuery({
    queryKey: ['couple-balance', currentUserId],
    queryFn: () => apiFetch<CoupleBalance>('/couple/balance'),
    enabled: enabled && hasValidCouple,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const linkMutation = useMutation({
    mutationFn: (values: FormValues) =>
      apiFetch('/couple/link', {
        method: 'POST',
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['couple', currentUserId] });
      void queryClient.invalidateQueries({ queryKey: ['couple-balance', currentUserId] });
      reset();
    },
  });

  if (!enabled) {
    return null;
  }

  if (isCoupleLoading) {
    return (
      <section className="panel">
        <h2>Couple</h2>
        <p>Loading partner data…</p>
      </section>
    );
  }

  if (!hasValidCouple) {
    return (
      <section className="panel">
        <h2>Couple</h2>
        <p className="hint">Link your partner to unlock shared expenses and balances.</p>
        <form
          onSubmit={handleSubmit((values) => linkMutation.mutate(values))}
          className="form compact-form"
        >
          <label>
            Partner email
            <input type="email" {...register('partnerEmail')} />
          </label>
          {errors.partnerEmail && (
            <p className="error">{errors.partnerEmail.message}</p>
          )}
          {linkMutation.isError && (
            <p className="error">{linkMutation.error.message}</p>
          )}
          <button type="submit" disabled={linkMutation.isPending}>
            {linkMutation.isPending ? 'Linking…' : 'Link Partner'}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>Couple</h2>
      <p className="hint">Partner linked: <strong>{partner?.email}</strong></p>
      {isBalanceLoading && <p>Loading balance…</p>}
      {balance && (
        <div className="balance-grid">
          <article className="balance-card">
            <span>You paid</span>
            <strong>${balance.totals.youPaid.toFixed(2)}</strong>
          </article>
          <article className="balance-card">
            <span>Your share</span>
            <strong>${balance.totals.yourShare.toFixed(2)}</strong>
          </article>
          <article className="balance-card">
            <span>You owe</span>
            <strong>${balance.youOwe.toFixed(2)}</strong>
          </article>
          <article className="balance-card">
            <span>Owed to you</span>
            <strong>${balance.owedToYou.toFixed(2)}</strong>
          </article>
        </div>
      )}
    </section>
  );
}
