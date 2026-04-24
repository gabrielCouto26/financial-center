import { useState } from 'react';
import { Avatar } from '../design-system/components';
import './Header.css';

interface HeaderProps {
  onMenuClick?: () => void;
  userInitials?: string;
  userName?: string;
}

export const Header = ({ onMenuClick, userInitials = 'FC', userName = 'Usuário' }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    // TODO: Implementar logout
    console.log('Logout');
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* Menu toggle para mobile */}
        <button
          className="header__menu-toggle"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" />
            <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" />
            <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" />
          </svg>
        </button>

        {/* Logo */}
        <div className="header__logo">
          <h1>Financial Center</h1>
        </div>

        {/* User menu */}
        <div className="header__user-menu">
          <button
            className="header__user-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu do usuário"
          >
            <Avatar size="sm" initials={userInitials} />
            <span className="header__user-name">{userName}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className={`header__menu-icon ${isMenuOpen ? 'header__menu-icon--open' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {isMenuOpen && (
            <div className="header__dropdown">
              <button className="header__dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Perfil
              </button>
              <button className="header__dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
                Configurações
              </button>
              <hr className="header__dropdown-divider" />
              <button className="header__dropdown-item header__dropdown-item--danger" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
