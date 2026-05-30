import { useState } from 'react';
import { FileText } from 'lucide-react';

interface Props {
  url: string;
  className?: string;
}

export function DniDocViewer({ url, className = '' }: Props) {
  const [broken, setBroken] = useState(false);
  const isPdf = url.includes('.pdf') || broken;

  if (isPdf) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-3 p-3 rounded-xl border border-ink-100 bg-ink-50 active:bg-ink-100 transition-colors ${className}`}
      >
        <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
          <FileText size={18} className="text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink-900">Documento PDF</p>
          <p className="text-xs text-ink-500">Toca para ver</p>
        </div>
      </a>
    );
  }

  return (
    <img
      src={url}
      alt="DNI"
      onError={() => setBroken(true)}
      className={`w-full rounded-xl border border-ink-100 object-cover max-h-40 ${className}`}
    />
  );
}
