import type { DashboardData } from '../../types/dashboard';

type Props = {
  summary: DashboardData['summary'];
  month: string;
};

export function SummaryCards({ summary, month }: Props) {
  return (
    <section className="dashboard-summary">
      <article className="hero-card">
        <span>This month</span>
        <strong>${summary.totalSpentThisMonth.toFixed(2)}</strong>
        <p>Total spent in {month}.</p>
      </article>
      <article className="hero-card">
        <span>Net position</span>
        <strong>${summary.currentBalance.toFixed(2)}</strong>
        <p>Current balance across personal, couple, and group contexts.</p>
      </article>
    </section>
  );
}
