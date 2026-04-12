import { IconCards } from '../../../design-system/Icons';

const MOCK_CATEGORIES = [
  { name: 'Aluguel & Contas', youPct: 50, partnerPct: 50, pillClass: '' },
  { name: 'Lazer & Jantares', youPct: 60, partnerPct: 40, pillClass: 'couple-category-pill--highlight' },
];

export function CategorySplitCard() {
  return (
    <div className="couple-section-card">
      <div className="couple-section-header">
        <h3 className="couple-section-title">
          <IconCards size={20} />
          Divisão por Categorias
        </h3>
      </div>

      <div className="couple-category-list">
        {MOCK_CATEGORIES.map((cat) => (
          <div key={cat.name}>
            <div className="couple-category-row-label">
              <span className="couple-category-name">{cat.name}</span>
              <span className={`couple-category-pill ${cat.pillClass}`}>
                {cat.youPct}/{cat.partnerPct}
              </span>
            </div>
            <div className="couple-progress-track">
              <div
                className="couple-progress-primary"
                style={{ width: `${cat.youPct}%` }}
              />
              <div
                className="couple-progress-secondary"
                style={{ width: `${cat.partnerPct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
