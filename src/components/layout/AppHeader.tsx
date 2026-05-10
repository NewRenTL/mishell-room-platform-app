import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface AppHeaderProps {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  transparent?: boolean;
}

export function AppHeader({ title, onBack, right, transparent = false }: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={`flex items-center justify-between px-4 py-3 ${transparent ? 'bg-transparent' : 'bg-white border-b border-ink-100'} sticky top-0 z-30`}>
      <button
        onClick={onBack ?? (() => navigate(-1))}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-ink-50 active:bg-ink-100 transition-colors"
      >
        <ChevronLeft size={22} className="text-ink-900" />
      </button>

      {title && (
        <h1 className="text-base font-semibold text-ink-900 absolute left-1/2 -translate-x-1/2">{title}</h1>
      )}

      <div className="w-9 h-9 flex items-center justify-center">
        {right}
      </div>
    </header>
  );
}
