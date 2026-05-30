import type { ReactNode } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  rightElement?: ReactNode;
  error?: string;
  label?: string;
}

export function Input({ icon, rightElement, error, label, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-ink-700 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
            {icon}
          </span>
        )}
        {rightElement && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </span>
        )}
        <input
          className={`
            w-full border border-ink-100 rounded-xl py-3.5 text-sm text-ink-900 bg-white
            placeholder:text-ink-400
            focus:outline-none focus:border-mishell-600 focus:ring-1 focus:ring-mishell-600
            disabled:bg-ink-50 disabled:text-ink-400
            ${icon ? 'pl-10' : 'pl-4'}
            ${rightElement ? 'pr-10' : 'pr-4'}
            ${error ? 'border-mishell-600' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-mishell-600">{error}</p>}
    </div>
  );
}
