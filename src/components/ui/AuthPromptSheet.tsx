import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, UserPlus, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Button } from './Button';

interface Props {
  open: boolean;
  onClose: () => void;
  /** Where to send the user after a successful login or register */
  redirectTo: string;
  title?: string;
  description?: string;
}

export function AuthPromptSheet({
  open,
  onClose,
  redirectTo,
  title = 'Necesitas una cuenta',
  description = 'Crea tu cuenta o inicia sesión para continuar con la reserva.',
}: Props) {
  const navigate = useNavigate();

  // On Capacitor (Android), the device back button closes the sheet instead of exiting the app
  useEffect(() => {
    if (!open || !Capacitor.isNativePlatform()) return;
    let listenerHandle: { remove: () => void } | undefined;
    CapacitorApp.addListener('backButton', () => onClose()).then((h) => { listenerHandle = h; });
    return () => { listenerHandle?.remove(); };
  }, [open, onClose]);

  function go(path: '/login' | '/register') {
    onClose();
    navigate(path, { state: { from: redirectTo } });
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative bg-white rounded-t-3xl px-5 pt-4 pb-8 flex flex-col gap-5"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          >
            <div className="w-10 h-1 bg-ink-200 rounded-full self-center" />

            <div className="flex flex-col items-center text-center gap-2.5">
              <div className="w-14 h-14 rounded-full bg-mishell-50 flex items-center justify-center">
                <Lock size={24} className="text-mishell-600" />
              </div>
              <p className="text-base font-bold text-ink-900">{title}</p>
              <p className="text-sm text-ink-500 leading-relaxed">{description}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={() => go('/register')}>
                <UserPlus size={16} className="mr-2" />
                Crear cuenta
              </Button>
              <button
                onClick={() => go('/login')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-ink-200 text-sm font-semibold text-ink-700 active:bg-ink-50 transition-colors"
              >
                <LogIn size={15} />
                Ya tengo cuenta
              </button>
              <button
                onClick={onClose}
                className="text-xs text-ink-400 hover:text-ink-600 transition-colors py-1"
              >
                Seguir explorando
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
