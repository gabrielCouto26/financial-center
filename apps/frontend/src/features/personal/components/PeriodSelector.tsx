import { Pill } from '../../../design-system/components';
import './PeriodSelector.css';

interface PeriodSelectorProps {
  currentPeriod: string;
  onPeriodChange: (period: string) => void;
}

export const PeriodSelector = ({ currentPeriod, onPeriodChange }: PeriodSelectorProps) => {
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return (
    <div className="period-selector">
      <div className="period-selector__nav">
        <button className="period-selector__arrow">←</button>
        <span className="period-selector__display">
          {months[currentMonth]} {currentYear}
        </span>
        <button className="period-selector__arrow">→</button>
      </div>
      <div className="period-selector__pills">
        {['Mês', 'Trimestre', '6 meses', 'Ano'].map((period) => (
          <Pill
            key={period}
            isActive={currentPeriod === period}
            onClick={() => onPeriodChange(period)}
          >
            {period}
          </Pill>
        ))}
      </div>
    </div>
  );
};
