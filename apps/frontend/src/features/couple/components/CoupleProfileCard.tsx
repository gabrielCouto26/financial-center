import type { CoupleSummary, CoupleBalance } from '../../../types/couple';
import type { SafeUser } from '../../../types/user';

type Props = {
  user?: SafeUser;
  summary: CoupleSummary;
  balance: CoupleBalance;
};

export function CoupleProfileCard({ user, summary, balance }: Props) {
  const partnerFirstName = summary.partner.name ?? summary.partner.email.split('@')[0];
  const totalSpend = balance.totals.youPaid + balance.totals.partnerPaid;
  const totalFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(totalSpend);

  const youInitial = user?.email?.charAt(0).toUpperCase() ?? '?';
  const partnerInitial = summary.partner.email.charAt(0).toUpperCase();

  return (
    <div className="couple-profile-card">
      <div className="couple-avatar-row">
        <div className="couple-avatar-stack">
          <div className="couple-avatar couple-avatar--you">{youInitial}</div>
          <div className="couple-avatar couple-avatar--partner">{partnerInitial}</div>
        </div>
      </div>

      <div className="couple-profile-names">
        <h5>Você & {partnerFirstName}</h5>
        <p>Conectados na plataforma</p>
      </div>

      <div className="couple-profile-stats">
        <div className="couple-stat">
          <span className="couple-stat-label">Gasto Total</span>
          <span className="couple-stat-value">{totalFormatted}</span>
        </div>
        <div className="couple-stat-divider" />
        <div className="couple-stat">
          <span className="couple-stat-label">Economia</span>
          <span className="couple-stat-value couple-stat-value--success">R$ 0</span>
        </div>
      </div>
    </div>
  );
}
