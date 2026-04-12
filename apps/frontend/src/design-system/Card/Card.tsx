import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'insight';
  padding?: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'var(--space-6)',
  className = '',
}) => {
  const classes = [
    'ds-card',
    `ds-card--${variant}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={{ padding }}>
      {children}
    </div>
  );
};
