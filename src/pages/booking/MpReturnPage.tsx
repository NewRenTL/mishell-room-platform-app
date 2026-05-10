import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/Button';

type Result = 'success' | 'failure' | 'pending' | 'loading';

export default function MpReturnPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<Result>('loading');

  const bookingId     = params.get('external_reference') ?? params.get('bookingId') ?? '';
  const collectionStatus = params.get('collection_status');

  useEffect(() => {
    if (collectionStatus === 'approved') {
      setResult('success');
    } else if (collectionStatus === 'rejected') {
      setResult('failure');
    } else if (collectionStatus === 'pending' || collectionStatus === 'in_process') {
      setResult('pending');
    } else {
      // fallback: read our own status param injected in back_urls
      const s = params.get('status');
      setResult((s as Result) ?? 'pending');
    }
  }, [collectionStatus, params]);

  const configs = {
    loading: {
      icon: null,
      color: '',
      title: 'Procesando pago…',
      subtitle: 'Por favor espera un momento.',
      action: null,
    },
    success: {
      icon: CheckCircle2,
      color: 'text-emerald-500',
      title: '¡Pago exitoso!',
      subtitle: 'Tu reserva ha sido confirmada. Recibirás los detalles por correo.',
      action: { label: 'Ver mi reserva', onClick: () => navigate(`/booking/success/${bookingId}`, { replace: true }) },
    },
    failure: {
      icon: XCircle,
      color: 'text-mishell-600',
      title: 'Pago rechazado',
      subtitle: 'No se pudo procesar el pago. Intenta con otro método o verifica tus datos.',
      action: { label: 'Volver a intentar', onClick: () => navigate(-1) },
    },
    pending: {
      icon: Clock,
      color: 'text-amber-500',
      title: 'Pago en proceso',
      subtitle: 'Tu pago está siendo verificado. Te notificaremos cuando se confirme.',
      action: { label: 'Ir a mis reservas', onClick: () => navigate('/my-bookings', { replace: true }) },
    },
  };

  const cfg = configs[result];

  return (
    <div className="max-w-[430px] mx-auto min-h-dvh bg-white flex flex-col items-center justify-center px-8 py-12">
      {result === 'loading' ? (
        <div className="w-10 h-10 border-2 border-mishell-600 border-t-transparent rounded-full animate-spin" />
      ) : (
        <motion.div
          className="flex flex-col items-center text-center gap-5 w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {cfg.icon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
            >
              <cfg.icon size={72} className={cfg.color} strokeWidth={1.5} />
            </motion.div>
          )}

          <div>
            <h1 className="text-xl font-bold text-ink-900 mb-2">{cfg.title}</h1>
            <p className="text-sm text-ink-600 leading-relaxed">{cfg.subtitle}</p>
          </div>

          {bookingId && result === 'success' && (
            <div className="bg-ink-50 rounded-2xl px-5 py-3 text-sm text-ink-500">
              Reserva <span className="font-bold text-ink-900">#{bookingId.slice(0, 8).toUpperCase()}</span>
            </div>
          )}

          {cfg.action && (
            <Button onClick={cfg.action.onClick} className="w-full mt-2">
              {cfg.action.label}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          )}

          {result !== 'success' && (
            <button
              onClick={() => navigate('/home', { replace: true })}
              className="text-sm text-ink-400 hover:text-ink-600 underline"
            >
              Ir al inicio
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
