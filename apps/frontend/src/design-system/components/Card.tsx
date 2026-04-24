import { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'minimal';
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  interactive?: boolean;
}

export const Card = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  onClick,
  interactive = false,
}: CardProps) => {
  return (
    <div
      className={`card card--${variant} card--p-${padding} ${interactive ? 'card--interactive' : ''} ${className}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </div>
  );
};
