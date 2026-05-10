import { useState } from 'react';
import { CreditCard, Smartphone, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../../components/ui/Button';
import { bookingsService } from '../../../services/bookings.service';
import { useBookingStore } from '../../../stores/bookingStore';
import type { PaymentMethod } from '../../../types';

interface Props {
  bookingId: string;
  onNext: () => void;
}

const METHODS: { key: PaymentMethod; label: string; description: string; Icon: typeof CreditCard }[] = [
  { key: 'CARD',         label: 'Tarjeta',       description: 'Visa, Mastercard, American Express',    Icon: CreditCard },
  { key: 'MERCADO_PAGO', label: 'Mercado Pago',  description: 'Paga con tu cuenta de Mercado Pago',   Icon: Smartphone },
  { key: 'YAPE',         label: 'Yape',           description: 'Pago rápido con tu número de celular', Icon: Smartphone },
];

export default function Step3Payment({ bookingId, onNext }: Props) {
  const setPaymentMethod = useBookingStore((s) => s.setPaymentMethod);
  const [selected, setSelected] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleNext() {
    if (!selected) { setError('Selecciona un método de pago'); return; }
    setError('');
    setLoading(true);
    try {
      await bookingsService.updatePayment(bookingId, selected);
      setPaymentMethod(selected);
      onNext();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al guardar método de pago');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-5 py-6 flex flex-col gap-5">
      <div>
        <h2 className="text-base font-bold text-ink-900 mb-1">Método de pago</h2>
        <p className="text-sm text-ink-600">Elige cómo quieres pagar tu estadía</p>
      </div>

      <div className="flex flex-col gap-3">
        {METHODS.map(({ key, label, description, Icon }, i) => (
          <motion.button
            key={key}
            type="button"
            onClick={() => setSelected(key)}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-colors text-left
              ${selected === key
                ? 'border-mishell-600 bg-mishell-50'
                : 'border-ink-100 bg-white hover:border-ink-200'}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
              ${selected === key ? 'bg-mishell-600' : 'bg-ink-100'}`}>
              <Icon size={18} className={selected === key ? 'text-white' : 'text-ink-600'} />
            </div>
            <div>
              <p className={`text-sm font-semibold ${selected === key ? 'text-mishell-700' : 'text-ink-900'}`}>{label}</p>
              <p className="text-xs text-ink-600">{description}</p>
            </div>
            {selected === key && (
              <motion.div
                className="ml-auto w-5 h-5 rounded-full bg-mishell-600 flex items-center justify-center flex-shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <div className="w-2 h-2 rounded-full bg-white" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="bg-ink-50 rounded-2xl p-4 flex items-start gap-2.5">
        <Info size={14} className="text-ink-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-ink-600">El cargo se realizará al confirmar la reserva. Puedes cancelar hasta 48 horas antes sin costo.</p>
      </div>

      {error && <p className="text-sm text-mishell-600 text-center">{error}</p>}

      <Button loading={loading} onClick={handleNext} disabled={!selected}>
        Continuar
      </Button>
    </div>
  );
}
