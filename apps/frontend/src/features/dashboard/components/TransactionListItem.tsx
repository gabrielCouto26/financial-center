import './TransactionListItem.css';

interface TransactionListItemProps {
  name: string;
  category: string;
  value: number;
  date: string;
  type: 'income' | 'expense';
  categoryColor?: string;
}

export const TransactionListItem = ({
  name,
  category,
  value,
  date,
  type,
  categoryColor = '#6B5FFF',
}: TransactionListItemProps) => {
  const isIncome = type === 'income';
  const formattedValue = isIncome ? `+${value.toFixed(2)}` : `-${value.toFixed(2)}`;

  return (
    <div className="transaction-item">
      <div className="transaction-item__icon" style={{ backgroundColor: categoryColor }}>
        {isIncome ? '↓' : '↑'}
      </div>
      <div className="transaction-item__content">
        <p className="transaction-item__name">{name}</p>
        <p className="transaction-item__category">{category}</p>
      </div>
      <div className="transaction-item__value" data-type={type}>
        {formattedValue}
      </div>
      <p className="transaction-item__date">{date}</p>
    </div>
  );
};
