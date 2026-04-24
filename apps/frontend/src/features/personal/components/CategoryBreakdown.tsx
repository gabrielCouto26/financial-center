import { Card, Badge } from '../../../design-system/components';
import './CategoryBreakdown.css';

interface Category {
  name: string;
  value: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
}

interface CategoryBreakdownProps {
  categories: Category[];
  total?: number;
}

export const CategoryBreakdown = ({ categories }: CategoryBreakdownProps) => {
  return (
    <div className="category-breakdown">
      <h3 className="category-breakdown__title">Despesas por Categoria</h3>
      <div className="category-breakdown__grid">
        {categories.map((cat) => (
          <Card key={cat.name} variant="minimal" padding="md" interactive className="category-card">
            <div className="category-card__icon" style={{ backgroundColor: cat.color }}>
              {cat.icon}
            </div>
            <p className="category-card__name">{cat.name}</p>
            <p className="category-card__value">R$ {cat.value.toFixed(2)}</p>
            <div className="category-card__progress">
              <div className="category-card__progress-bar">
                <div
                  className="category-card__progress-fill"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
              <Badge variant="primary" size="sm">
                {cat.percentage.toFixed(0)}%
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
