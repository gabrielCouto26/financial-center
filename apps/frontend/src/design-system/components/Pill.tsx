import { ReactNode } from 'react';
import './Pill.css';

interface PillProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'default';
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Pill = ({
  children,
  variant = 'default',
  isActive = false,
  onClick,
  className = '',
}: PillProps) => {
  return (
    <button
      className={`pill pill--${variant} ${isActive ? 'pill--active' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
