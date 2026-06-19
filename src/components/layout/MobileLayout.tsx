import { Home, MessageCircle, Key, User, Banknote, Clock, Building2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuthStore } from '../../stores/authStore';

const TABS_INQUILINO = [
  { path: '/home',         icon: Home,          label: 'Inicio'   },
  { path: '/my-bookings',  icon: Key,           label: 'Reservas' },
  { path: '/my-payments',  icon: Banknote,      label: 'Pagos'    },
  { path: '/messages',     icon: MessageCircle, label: 'Mensajes' },
  { path: '/profile',      icon: User,          label: 'Perfil'   },
];

const TABS_SOCIO = [
  { path: '/socio',        icon: Building2,     label: 'Mis Prop.' },
  { path: '/my-bookings',  icon: Key,           label: 'Reservas'  },
  { path: '/messages',     icon: MessageCircle, label: 'Mensajes'  },
  { path: '/profile',      icon: User,          label: 'Perfil'    },
];

interface MobileLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export function MobileLayout({ children, hideNav = false }: MobileLayoutProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);

  const tabs = user?.role === 'SOCIO' ? TABS_SOCIO : TABS_INQUILINO;

  return (
    <div className="h-dvh flex flex-col max-w-[430px] mx-auto bg-ink-50 relative">
      {user?.status === 'INACTIVE' && (
        <div className="sticky top-0 z-40 flex items-center gap-2 px-4 py-2.5 bg-amber-50 border-b border-amber-200">
          <Clock size={14} className="text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800 font-medium leading-snug">
            Tu cuenta está pendiente de verificación. No puedes realizar reservas hasta que el administrador la apruebe.
          </p>
        </div>
      )}
      <main className={`flex-1 overflow-y-auto ${hideNav ? '' : 'pb-20'}`}>
        {children}
      </main>

      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-ink-100 flex h-16 z-50 shadow-sm">
          {tabs.map(({ path, icon: Icon, label }) => {
            const active = pathname === path
              || (path !== '/home' && path !== '/socio' && pathname.startsWith(path));
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute top-1.5 w-10 h-1 bg-mishell-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <motion.div
                  animate={{ y: active ? 3 : 0 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                >
                  <Icon
                    size={20}
                    className={active ? 'text-mishell-600' : 'text-ink-400'}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                </motion.div>
                <span className={`text-[10px] font-semibold leading-none ${active ? 'text-mishell-600' : 'text-ink-400'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
