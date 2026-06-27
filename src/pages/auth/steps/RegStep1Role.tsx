import { Search, Building2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { RegRole } from '../../../types/auth';

interface Props {
  selected: RegRole | null;
  onSelect: (role: RegRole) => void;
}

const ROLES = [
  {
    role: 'INQUILINO' as const,
    icon: Search,
    title: 'Busco habitación',
    subtitle: 'Quiero alquilar un cuarto',
    activeBorder: 'border-mishell-500',
    activeBg: 'bg-mishell-50',
    iconActive: 'bg-mishell-100 text-mishell-600',
    perks: ['Explora propiedades disponibles', 'Reserva y firma contratos', 'Pago semanal en línea'],
  },
  {
    role: 'SOCIO' as const,
    icon: Building2,
    title: 'Tengo una propiedad',
    subtitle: 'Quiero publicar habitaciones',
    activeBorder: 'border-ink-800',
    activeBg: 'bg-ink-50',
    iconActive: 'bg-ink-800 text-white',
    perks: ['Publica y gestiona habitaciones', 'Contratos digitales', 'Cobra en línea'],
  },
];

export default function RegStep1Role({ selected, onSelect }: Props) {
  return (
    <div className="px-5 pt-8 pb-6 flex flex-col gap-5">
      {/* Step heading */}
      <div>
        <h2 className="text-xl font-bold text-ink-900 leading-tight">¿Cómo usarás{'\n'}Mishell Room?</h2>
        <p className="text-sm text-ink-500 mt-1">Selecciona tu perfil para personalizar la experiencia</p>
      </div>

      {/* Role cards */}
      <div className="flex flex-col gap-3">
        {ROLES.map(({ role, icon: Icon, title, subtitle, activeBorder, activeBg, iconActive, perks }) => {
          const active = selected === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => onSelect(role)}
              className={`w-full flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                active ? `${activeBorder} ${activeBg}` : 'border-ink-150 bg-white hover:border-ink-300'
              }`}
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                active ? iconActive : 'bg-ink-100 text-ink-400'
              }`}>
                <Icon size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${active ? 'text-ink-900' : 'text-ink-600'}`}>{title}</p>
                <p className={`text-xs mb-2 ${active ? 'text-ink-500' : 'text-ink-400'}`}>{subtitle}</p>
                <ul className="flex flex-col gap-1">
                  {perks.map((p) => (
                    <li key={p} className={`flex items-center gap-1.5 text-xs ${active ? 'text-ink-600' : 'text-ink-400'}`}>
                      <CheckCircle2 size={11} className={active ? 'text-mishell-500 shrink-0' : 'text-ink-300 shrink-0'} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {active && (
                <motion.div
                  className="w-5 h-5 rounded-full bg-mishell-500 flex items-center justify-center shrink-0 mt-0.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
