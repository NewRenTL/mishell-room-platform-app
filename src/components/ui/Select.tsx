import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options?: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  searchable?: boolean;
}

export function Select({
  label, error, hint, placeholder, options = [],
  value, onChange, required, disabled, className = '',
  searchable = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selected = options.find((o) => o.value === value);

  const filtered = searchable && search.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    if (open) {
      document.addEventListener('mousedown', onOutside);
      if (searchable) setTimeout(() => searchRef.current?.focus(), 80);
    }
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open, searchable]);

  function handleClose() {
    setOpen(false);
    setSearch('');
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-ink-700 mb-1.5 select-none">
          {label}
          {required && <span className="text-mishell-600 ml-1">*</span>}
        </label>
      )}

      <div ref={containerRef} className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((v) => !v)}
          className={`
            w-full border rounded-xl py-3.5 px-4 text-sm text-left flex items-center justify-between
            bg-white transition-all duration-200
            ${disabled ? 'bg-ink-50 text-ink-400 cursor-not-allowed' : 'cursor-pointer'}
            ${error
              ? 'border-mishell-500 ring-1 ring-mishell-500/30'
              : open
                ? 'border-mishell-600 ring-1 ring-mishell-600/20'
                : 'border-ink-100 hover:border-ink-200'
            }
          `}
        >
          <span className={selected ? 'text-ink-900' : 'text-ink-400'}>
            {selected?.label ?? placeholder ?? 'Selecciona...'}
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="shrink-0 ml-2"
          >
            <ChevronDown size={16} className="text-ink-400" />
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-ink-100 rounded-2xl shadow-xl shadow-ink-900/8 z-200 overflow-hidden"
            >
              {searchable && (
                <div className="px-3 pt-2.5 pb-2 border-b border-ink-100">
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
                    <input
                      ref={searchRef}
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar..."
                      className="w-full border border-ink-100 rounded-lg pl-7 pr-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-mishell-600"
                    />
                  </div>
                </div>
              )}

              <div className="py-1.5 max-h-52 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-center text-xs text-ink-400 py-4">Sin resultados</p>
                ) : (
                  filtered.map((opt) => {
                    const isSelected = opt.value === value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={opt.disabled}
                        onClick={() => { if (!opt.disabled) { onChange?.(opt.value); handleClose(); } }}
                        className={`
                          w-full text-left px-4 py-3 text-sm flex items-center justify-between gap-2
                          transition-colors duration-100
                          ${isSelected ? 'bg-mishell-50 text-mishell-700 font-semibold' : 'text-ink-800 hover:bg-ink-50'}
                          ${opt.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check size={14} className="text-mishell-600 shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && <p className="mt-1 text-xs text-mishell-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
