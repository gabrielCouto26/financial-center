import { Card } from '../../../design-system/components';
import './StatCard.css';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'danger';
}

export const StatCard = ({ label, value, subtext, icon, color = 'primary' }: StatCardProps) => {
  return (
    <Card variant="glass" padding="md" className={`stat-card stat-card--${color}`}>
      <div className="stat-card__content">
        {icon && <div className="stat-card__icon">{icon}</div>}
        <div className="stat-card__text">
          <p className="stat-card__label">{label}</p>
          <p className="stat-card__value">{value}</p>
          {subtext && <p className="stat-card__subtext">{subtext}</p>}
        </div>
      </div>
    </Card>
  );
};
