import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'underlined' | 'outline';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  variant = 'underlined',
  className = '',
  ...props
}) => {
  const containerClasses = [
    'ds-input-container',
    `ds-input--${variant}`,
    error ? 'ds-input--error' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && <label className="ds-input__label">{label}</label>}
      <input className="ds-input__field" {...props} />
      {error && <p className="ds-input__error-msg">{error}</p>}
    </div>
  );
};
