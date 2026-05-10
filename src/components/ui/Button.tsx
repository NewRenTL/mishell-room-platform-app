interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
}

export function Button({ variant = 'primary', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'w-full font-semibold rounded-full h-14 text-base transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary:   'bg-mishell-600 hover:bg-mishell-500 active:bg-mishell-700 text-white',
    secondary: 'bg-white border border-ink-100 hover:bg-ink-50 text-ink-900',
    ghost:     'bg-transparent text-mishell-600 hover:underline h-auto font-semibold',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  );
}
