import { useState, useRef, useEffect } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimeInputProps {
  label?: string;
  value?: string; // HH:mm
  onChange?: (value: string) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function parseTime(v: string): [number, number] {
  if (!v) return [9, 0];
  const [h, m] = v.split(':').map(Number);
  return [isNaN(h) ? 9 : h, isNaN(m) ? 0 : m];
}

export function TimeInput({
  label, value = '', onChange, error, hint,
  disabled, required, className = '', placeholder,
}: TimeInputProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [h, m] = parseTime(value);
  const [draftH, setDraftH] = useState(h);
  const [draftM, setDraftM] = useState(m);

  useEffect(() => {
    if (open) { const [ph, pm] = parseTime(value); setDraftH(ph); setDraftM(pm); }
  }, [open, value]);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  function confirm() {
    onChange?.(`${pad(draftH)}:${pad(draftM)}`);
    setOpen(false);
  }

  const display = value ? `${pad(h)}:${pad(m)}` : '';

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
            w-full border rounded-xl py-3.5 pl-11 pr-4 text-sm text-left bg-white
            transition-all duration-200
            ${disabled ? 'bg-ink-50 text-ink-400 cursor-not-allowed' : 'cursor-pointer'}
            ${error
              ? 'border-mishell-500 ring-1 ring-mishell-500/30'
              : open
                ? 'border-mishell-600 ring-1 ring-mishell-600/20'
                : 'border-ink-100 hover:border-ink-200'
            }
          `}
        >
          <span className={display ? 'text-ink-900' : 'text-ink-400'}>
            {display || placeholder || 'Selecciona hora'}
          </span>
        </button>

        <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="absolute top-full left-0 mt-2 z-200 bg-white border border-ink-100 rounded-2xl shadow-xl shadow-ink-900/10 overflow-hidden"
              style={{ minWidth: 192 }}
            >
              {/* Header */}
              <div
                className="px-4 py-2.5 text-center text-xs font-bold text-white tracking-wide"
                style={{ background: 'linear-gradient(135deg, #A31A1D 0%, #E8272A 100%)' }}
              >
                Seleccionar hora
              </div>

              {/* Spinners */}
              <div className="flex items-center justify-center gap-3 px-4 py-4">
                {/* Hours */}
                <div className="flex flex-col items-center gap-1.5">
                  <button type="button" onClick={() => setDraftH((v) => (v + 1) % 24)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-mishell-50 text-mishell-600 transition-colors active:scale-95">
                    <ChevronUp size={18} />
                  </button>
                  <div className="w-14 h-11 rounded-xl border border-ink-100 flex items-center justify-center text-2xl font-black text-ink-900 bg-ink-50">
                    {pad(draftH)}
                  </div>
                  <button type="button" onClick={() => setDraftH((v) => (v - 1 + 24) % 24)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-mishell-50 text-mishell-600 transition-colors active:scale-95">
                    <ChevronDown size={18} />
                  </button>
                  <span className="text-[10px] text-ink-400 font-medium">Horas</span>
                </div>

                <span className="text-3xl font-black text-ink-200 pb-5">:</span>

                {/* Minutes */}
                <div className="flex flex-col items-center gap-1.5">
                  <button type="button" onClick={() => setDraftM((v) => (v + 5) % 60)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-mishell-50 text-mishell-600 transition-colors active:scale-95">
                    <ChevronUp size={18} />
                  </button>
                  <div className="w-14 h-11 rounded-xl border border-ink-100 flex items-center justify-center text-2xl font-black text-ink-900 bg-ink-50">
                    {pad(draftM)}
                  </div>
                  <button type="button" onClick={() => setDraftM((v) => (v - 5 + 60) % 60)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-mishell-50 text-mishell-600 transition-colors active:scale-95">
                    <ChevronDown size={18} />
                  </button>
                  <span className="text-[10px] text-ink-400 font-medium">Minutos</span>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 pb-4 flex gap-2">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 text-sm font-semibold text-ink-500 border border-ink-100 rounded-xl hover:bg-ink-50 transition-colors">
                  Cancelar
                </button>
                <button type="button" onClick={confirm}
                  className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors"
                  style={{ background: 'linear-gradient(135deg, #E8272A, #C41F22)' }}>
                  Listo
                </button>
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
