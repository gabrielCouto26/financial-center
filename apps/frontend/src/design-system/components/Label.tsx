import { ReactNode } from 'react';
import './Label.css';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
}

export const Label = ({ children, required, className = '', ...props }: LabelProps) => {
  return (
    <label className={`label ${className}`} {...props}>
      {children}
      {required && <span className="label__required">*</span>}
    </label>
  );
};
