export function CoupleGoalCard() {
  // Mock data — backend endpoint for goals not yet implemented.
  const goalName = 'Viagem Japão';
  const goalPct = 65;
  const remaining = 4200;

  return (
    <div className="couple-goal-card">
      <p className="couple-goal-eyebrow">Meta do Casal</p>
      <div className="couple-goal-header">
        <h4 className="couple-goal-name">{goalName}</h4>
        <span className="couple-goal-pct">{goalPct}%</span>
      </div>
      <div className="couple-goal-track">
        <div className="couple-goal-fill" style={{ width: `${goalPct}%` }} />
      </div>
      <p className="couple-goal-foot">
        Faltam{' '}
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(remaining)}{' '}
        para o objetivo.
      </p>
    </div>
  );
}
