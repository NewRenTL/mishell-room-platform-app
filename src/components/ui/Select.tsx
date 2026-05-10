import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
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
}

export function Select({
  label, error, hint, placeholder, options = [],
  value, onChange, required, disabled, className = '',
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

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
              <div className="py-1.5 max-h-60 overflow-y-auto">
                {options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={opt.disabled}
                      onClick={() => { if (!opt.disabled) { onChange?.(opt.value); setOpen(false); } }}
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
                })}
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
