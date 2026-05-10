import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const WEEKDAYS = ['Lu','Ma','Mi','Ju','Vi','Sá','Do'];

interface DateInputProps {
  label?: string;
  error?: string;
  hint?: string;
  value?: string; // YYYY-MM-DD
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  placeholder?: string;
  min?: string;
  max?: string;
}

function parseDate(v: string): Date | null {
  if (!v) return null;
  const [y, m, d] = v.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function toISO(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDisplay(v: string): string {
  const d = parseDate(v);
  if (!d) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function buildGrid(year: number, month: number): (number | null)[] {
  const total = new Date(year, month + 1, 0).getDate();
  const rawFirst = new Date(year, month, 1).getDay();
  const firstDay = rawFirst === 0 ? 6 : rawFirst - 1;
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function DateInput({
  label, error, hint, value = '', onChange,
  disabled, required, className = '', placeholder, min, max,
}: DateInputProps) {
  const today = new Date();
  const selected = parseDate(value);

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  function toggle() {
    if (disabled) return;
    if (!open && selected) { setViewYear(selected.getFullYear()); setViewMonth(selected.getMonth()); }
    setOpen((v) => !v);
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  function selectDay(day: number) {
    onChange?.(toISO(new Date(viewYear, viewMonth, day)));
    setOpen(false);
  }

  const cells = buildGrid(viewYear, viewMonth);
  const display = formatDisplay(value);

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
          onClick={toggle}
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
            {display || placeholder || 'Selecciona fecha'}
          </span>
        </button>

        <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="absolute top-full left-0 mt-2 z-200 rounded-2xl border border-ink-100 bg-white shadow-xl shadow-ink-900/10 overflow-hidden"
              style={{ minWidth: 240 }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-3 py-2.5"
                style={{ background: 'linear-gradient(135deg, #A31A1D 0%, #E8272A 100%)' }}
              >
                <button type="button" onClick={prevMonth}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs font-bold text-white tracking-wide">
                  {MONTHS[viewMonth]} {viewYear}
                </span>
                <button type="button" onClick={nextMonth}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Weekdays */}
              <div className="grid grid-cols-7 border-b border-ink-50 bg-ink-50">
                {WEEKDAYS.map((w) => (
                  <div key={w} className="py-1.5 text-center text-[9px] font-bold text-ink-400 uppercase tracking-wider">{w}</div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-px p-2">
                {cells.map((day, i) => {
                  if (!day) return <div key={`e-${i}`} />;

                  const cellDate = new Date(viewYear, viewMonth, day);
                  const minDate = min ? parseDate(min) : null;
                  const maxDate = max ? parseDate(max) : null;
                  const isOutOfRange = (minDate && cellDate < minDate) || (maxDate && cellDate > maxDate);
                  const isSelected = !!selected &&
                    day === selected.getDate() && viewMonth === selected.getMonth() && viewYear === selected.getFullYear();
                  const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

                  if (isOutOfRange) {
                    return (
                      <div key={`d-${day}`}
                        className="flex items-center justify-center rounded-lg text-[11px] w-full aspect-square text-ink-200 cursor-not-allowed select-none">
                        {day}
                      </div>
                    );
                  }

                  return (
                    <motion.button
                      key={`d-${day}`}
                      type="button"
                      onClick={() => selectDay(day)}
                      whileHover={{ scale: isSelected ? 1 : 1.08 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.1 }}
                      className={`
                        flex items-center justify-center rounded-lg text-[11px] font-medium
                        w-full aspect-square transition-colors duration-100
                        ${isSelected
                          ? 'text-white shadow-sm'
                          : isToday
                            ? 'bg-mishell-50 text-mishell-700 font-bold ring-1 ring-mishell-200'
                            : 'text-ink-700 hover:bg-mishell-50 hover:text-mishell-700'
                        }
                      `}
                      style={isSelected ? { background: 'linear-gradient(135deg, #E8272A, #A31A1D)' } : undefined}
                    >
                      {day}
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-3 pb-2.5 pt-1 flex items-center justify-between border-t border-ink-50">
                <span className="text-[10px] text-ink-400">
                  {selected ? formatDisplay(value) : 'Sin seleccionar'}
                </span>
                <button
                  type="button"
                  onClick={() => { onChange?.(toISO(today)); setOpen(false); }}
                  className="text-[11px] font-semibold text-mishell-600 hover:text-mishell-800 transition-colors px-2 py-0.5 rounded-lg hover:bg-mishell-50"
                >
                  Hoy
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
