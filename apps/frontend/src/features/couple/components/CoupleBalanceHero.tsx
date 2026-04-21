import type { CoupleSummary, CoupleBalance } from '../../../types/couple';

type Props = {
  summary: CoupleSummary;
  balance: CoupleBalance;
};

export function CoupleBalanceHero({ summary, balance }: Props) {
  const partnerFirstName = summary.partner.name ?? summary.partner.email.split('@')[0];

  let labelModifier = 'neutral';
  let amountModifier = 'neutral';
  let oweLabel = 'Tudo em dia';
  let oweValue = 'R$ 0,00';

  if (balance.youOwe > 0) {
    oweLabel = `Você deve a ${partnerFirstName}`;
    oweValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance.youOwe);
    labelModifier = 'danger';
    amountModifier = 'danger';
  } else if (balance.owedToYou > 0) {
    oweLabel = `${partnerFirstName} deve a você`;
    oweValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance.owedToYou);
    labelModifier = 'success';
    amountModifier = 'success';
  }

  return (
    <section className="couple-hero">
      <div>
        <p className="couple-hero-eyebrow">Modo Casal</p>
        <h2 className="couple-hero-title">Quem deve quem</h2>
        <p className="couple-hero-subtitle">
          Uma visão clara dos acertos pendentes entre você e {partnerFirstName}.
        </p>
      </div>
      <div className="couple-hero-balance">
        <span className={`couple-hero-balance-label couple-hero-balance-label--${labelModifier}`}>
          {oweLabel}
        </span>
        <p className={`couple-hero-amount couple-hero-amount--${amountModifier}`}>
          {oweValue}
        </p>
      </div>
    </section>
  );
}
