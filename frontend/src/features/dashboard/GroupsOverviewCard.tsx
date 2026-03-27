import type { DashboardData } from '../../types/dashboard';

type Props = {
  groups: DashboardData['groups'];
};

export function GroupsOverviewCard({ groups }: Props) {
  return (
    <section className="panel">
      <h2>Groups</h2>
      <div className="balance-grid">
        <article className="balance-card">
          <span>Active groups</span>
          <strong>{groups.groupCount}</strong>
        </article>
        <article className="balance-card">
          <span>Total net</span>
          <strong>${groups.totalNet.toFixed(2)}</strong>
        </article>
      </div>
    </section>
  );
}
