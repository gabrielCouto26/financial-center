import { ReactNode } from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = ({
  label,
  error,
  helperText,
  icon,
  fullWidth = false,
  className = '',
  id,
  ...props
}: InputProps) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`input-group ${fullWidth ? 'input-group--full' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-group__label">
          {label}
        </label>
      )}
      <div className="input-group__wrapper">
        {icon && <span className="input-group__icon">{icon}</span>}
        <input
          id={inputId}
          className={`input-group__input ${error ? 'input-group__input--error' : ''} ${icon ? 'input-group__input--with-icon' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="input-group__error">{error}</span>}
      {helperText && !error && <span className="input-group__helper">{helperText}</span>}
    </div>
  );
};
