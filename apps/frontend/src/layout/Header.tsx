import { useState } from "react";
import type { SafeUser } from "../types/user";
import "./Header.css";

type Props = {
  user?: SafeUser;
  onLogout?: () => void;
};

export function Header({ user, onLogout }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const userInitial = user?.email?.charAt(0).toUpperCase() ?? "";
  const userName = user?.name ?? "";

  const handleAvatarClick = () => {
    if (onLogout) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleLogout = () => {
    onLogout?.();
    setIsDropdownOpen(false);
  };

  return (
    <header className="header">
      <div className="header-logo">
        <h1>Financial Center</h1>
      </div>

      <div className="header-content">
        <div className="header-title">
          <span>
            Olá, <strong>{userName}</strong>
          </span>
        </div>

        <div className="header-actions">
          <div
            className="user-profile"
            onClick={handleAvatarClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleAvatarClick();
              }
            }}
            role={onLogout ? "button" : undefined}
            tabIndex={onLogout ? 0 : undefined}
          >
            <span className="user-avatar-fallback">{userInitial}</span>
            {onLogout && (
              <div
                className={`user-dropdown ${isDropdownOpen ? "user-dropdown--open" : ""}`}
              >
                <div className="user-dropdown-menu">
                  <button className="logout-btn" onClick={handleLogout}>
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
