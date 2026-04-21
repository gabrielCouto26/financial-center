import type { ReactNode } from 'react';
import './AuthenticatedPage.css';

type Props = {
  children: ReactNode;
  className?: string;
  width?: 'default' | 'narrow';
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

export function AuthenticatedPage({
  children,
  className = '',
  width = 'default',
  eyebrow,
  title,
  description,
  actions,
}: Props) {
  const classes = [
    'authenticated-page',
    `authenticated-page--${width}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hasHeader = Boolean(eyebrow || title || description || actions);

  return (
    <div className={classes}>
      <div className="authenticated-page__inner">
        {hasHeader ? (
          <header className="authenticated-page__header">
            <div className="authenticated-page__heading">
              {eyebrow ? (
                <p className="authenticated-page__eyebrow">{eyebrow}</p>
              ) : null}
              {title ? <h1 className="authenticated-page__title">{title}</h1> : null}
              {description ? (
                <p className="authenticated-page__description">{description}</p>
              ) : null}
            </div>
            {actions ? <div className="authenticated-page__actions">{actions}</div> : null}
          </header>
        ) : null}
        <div className="authenticated-page__content">{children}</div>
      </div>
    </div>
  );
}
