import React from 'react';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  pill?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  pill = true,
  className = '',
}) => {
  const classes = [
    'ds-badge',
    `ds-badge--${variant}`,
    pill ? 'ds-badge--pill' : '',
    className,
  ].filter(Boolean).join(' ');

  return <span className={classes}>{children}</span>;
};
