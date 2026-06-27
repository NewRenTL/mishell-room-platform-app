import { useState } from 'react';
import { CreditCard, Info, Banknote, Building2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../../components/ui/Button';
import { bookingsService } from '../../../services/bookings.service';
import { getApiErrorMessage } from '../../../utils/error';
import { useBookingStore } from '../../../stores/bookingStore';
import type { PaymentMethod } from '../../../types';

interface Props {
  bookingId: string;
  onNext: () => void;
}

type Method = {
  key: PaymentMethod;
  label: string;
  description: string;
  logo?: string;
  Icon?: typeof CreditCard;
  manual?: boolean;
};

const METHODS: Method[] = [
  { key: 'YAPE',          label: 'Yape',             description: 'Pago instantáneo desde tu celular',          logo: '/YapeLogo.png' },
  { key: 'MERCADO_PAGO',  label: 'MercadoPago',      description: 'Tarjeta / crédito',                          logo: '/MercadoPagoLogo.png' },
  { key: 'CARD',          label: 'Tarjeta',           description: 'Visa, Mastercard, American Express',         Icon: CreditCard },
  { key: 'TRANSFERENCIA', label: 'Transferencia',     description: 'Transfiere y sube tu comprobante',           Icon: Building2, manual: true },
  { key: 'EFECTIVO',      label: 'Efectivo',          description: 'Paga en persona al encargado',               Icon: Banknote,  manual: true },
];

function MethodCard({ methodKey, label, description, logo, Icon, selected, index, onSelect }: {
  methodKey: PaymentMethod; label: string; description: string;
  logo?: string; Icon?: typeof CreditCard; selected: PaymentMethod | null;
  index: number; onSelect: (k: PaymentMethod) => void;
}) {
  const active = selected === methodKey;
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(methodKey)}
      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-colors text-left
        ${active ? 'border-mishell-600 bg-mishell-50' : 'border-ink-100 bg-white hover:border-ink-200'}`}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden
        ${logo ? 'bg-white border border-ink-100' : active ? 'bg-mishell-600' : 'bg-ink-100'}`}>
        {logo
          ? <img src={logo} alt={label} className="w-10 h-10 rounded object-contain" />
          : Icon && <Icon size={18} className={active ? 'text-white' : 'text-ink-600'} />}
      </div>
      <div>
        <p className={`text-sm font-semibold ${active ? 'text-mishell-700' : 'text-ink-900'}`}>{label}</p>
        <p className="text-xs text-ink-600">{description}</p>
      </div>
      {active && (
        <motion.div
          className="ml-auto w-5 h-5 rounded-full bg-mishell-600 flex items-center justify-center shrink-0"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <div className="w-2 h-2 rounded-full bg-white" />
        </motion.div>
      )}
    </motion.button>
  );
}

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
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Error al guardar método de pago'));
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

      {/* Gateway methods */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-bold text-ink-400 uppercase tracking-widest">Pago en línea</p>
        {METHODS.filter((m) => !m.manual).map(({ key, label, description, logo, Icon }, i) => (
          <MethodCard key={key} methodKey={key} label={label} description={description}
            logo={logo} Icon={Icon} selected={selected} index={i} onSelect={setSelected} />
        ))}
      </div>

      {/* Manual methods */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-bold text-ink-400 uppercase tracking-widest">Pago manual</p>
        {METHODS.filter((m) => m.manual).map(({ key, label, description, Icon }, i) => (
          <MethodCard key={key} methodKey={key} label={label} description={description}
            Icon={Icon} selected={selected} index={i + 3} onSelect={setSelected} />
        ))}
      </div>

      {selected && ['TRANSFERENCIA', 'EFECTIVO'].includes(selected) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-2.5">
          <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            {selected === 'TRANSFERENCIA'
              ? 'Deberás subir el comprobante de transferencia en el siguiente paso. El administrador confirmará tu pago.'
              : 'El administrador registrará tu pago en persona y confirmará la reserva.'}
          </p>
        </div>
      )}

      {!selected || !['TRANSFERENCIA', 'EFECTIVO'].includes(selected) ? (
        <div className="bg-ink-50 rounded-2xl p-4 flex items-start gap-2.5">
          <Info size={14} className="text-ink-400 shrink-0 mt-0.5" />
          <p className="text-xs text-ink-600">El cargo se realizará al confirmar la reserva.</p>
        </div>
      ) : null}

      {error && <p className="text-sm text-mishell-600 text-center">{error}</p>}

      <Button loading={loading} onClick={handleNext} disabled={!selected}>
        Continuar
      </Button>
    </div>
  );
}
