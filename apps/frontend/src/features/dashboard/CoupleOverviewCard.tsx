import type { DashboardData } from '../../types/dashboard';

type Props = {
  couple: DashboardData['couple'];
};

export function CoupleOverviewCard({ couple }: Props) {
  return (
    <section className="panel">
      <h2>Couple</h2>
      {!couple.isLinked ? (
        <p className="hint">No partner linked yet.</p>
      ) : (
        <div className="balance-grid">
          <article className="balance-card">
            <span>You owe</span>
            <strong>${couple.youOwe.toFixed(2)}</strong>
          </article>
          <article className="balance-card">
            <span>Owed to you</span>
            <strong>${couple.owedToYou.toFixed(2)}</strong>
          </article>
          <article className="balance-card">
            <span>Net</span>
            <strong>${couple.net.toFixed(2)}</strong>
          </article>
        </div>
      )}
    </section>
  );
}
