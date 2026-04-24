import { useEffect } from 'react';
import './Sidebar.css';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  isActive?: boolean;
}

interface SidebarProps {
  items: NavItem[];
  onNavigate?: (href: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ items, onNavigate, isOpen = true, onClose }: SidebarProps) => {
  // Fechar sidebar em mobile quando clicar em um item
  useEffect(() => {
    if (!isOpen && onClose) {
      onClose();
    }
  }, [isOpen, onClose]);

  const handleNavClick = (href: string) => {
    onNavigate?.(href);
    onClose?.();
  };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && <div className="sidebar__overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <nav className="sidebar__nav">
          <ul className="sidebar__menu">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  className={`sidebar__item ${item.isActive ? 'sidebar__item--active' : ''}`}
                  onClick={() => handleNavClick(item.href)}
                  aria-current={item.isActive ? 'page' : undefined}
                >
                  <span className="sidebar__icon">{item.icon}</span>
                  <span className="sidebar__label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer da sidebar (opcional) */}
        <div className="sidebar__footer">
          <p className="sidebar__version">FC v1.0</p>
        </div>
      </aside>
    </>
  );
};
