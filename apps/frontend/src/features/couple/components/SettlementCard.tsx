import type { CoupleSummary, CoupleBalance } from '../../../types/couple';

type Props = {
  summary: CoupleSummary;
  balance: CoupleBalance;
};

export function SettlementCard({ summary, balance }: Props) {
  const owesYou = balance.owedToYou > 0;
  const youOwe = balance.youOwe > 0;

  let text = 'Todas as contas estão em dia entre vocês.';
  if (owesYou) {
    const partnerName = summary.partner.email.split('@')[0];
    text = `Considerando todas as despesas, o saldo favorece você. ${partnerName} deve te pagar.`;
  } else if (youOwe) {
    text = 'Considerando todas as despesas, o saldo favorece o seu parceiro. Você tem dívidas a liquidar.';
  }

  return (
    <div className="couple-settlement-card">
      <h4 className="couple-settlement-title">Acerto de Contas</h4>
      <p className="couple-settlement-text">{text}</p>
      <button
        className="couple-settle-btn"
        disabled={!owesYou && !youOwe}
      >
        Liquidar Saldo
      </button>
    </div>
  );
}
