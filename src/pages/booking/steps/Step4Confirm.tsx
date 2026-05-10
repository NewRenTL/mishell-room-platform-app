import { useEffect, useRef, useState } from 'react';
import { MapPin, Calendar, User, AlertCircle, Smartphone, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../../components/ui/Button';
import { paymentsService } from '../../../services/payments.service';
import { useBookingStore } from '../../../stores/bookingStore';
import type { Property } from '../../../types';

const IS_SANDBOX = import.meta.env.VITE_IS_SANDBOX !== 'false';

function fmt(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface Props {
  bookingId: string;
  property?: Property;
  onSuccess: () => void;
}

// ─── Yape inline form ────────────────────────────────────────────────────────

function YapeForm({ bookingId, total, onSuccess }: { bookingId: string; total: number; onSuccess: () => void }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mpReady, setMpReady] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if ((window as any).MercadoPago) { setMpReady(true); return; }
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => setMpReady(true);
    document.head.appendChild(script);
    scriptRef.current = script;
    return () => {
      script.onload = null;
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  async function handlePay() {
    if (!phone.trim() || !otp.trim()) { setError('Ingresa tu número y el código OTP de Yape'); return; }
    if (!mpReady) { setError('SDK de pago no cargó. Recarga la página.'); return; }
    setError('');
    setLoading(true);
    try {
      const mp = new (window as any).MercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: 'es-PE' });
      const yape = mp.yape({ otp: Number(otp), phoneNumber: Number(phone) });
      const tokenResult = await yape.create();
      if (!tokenResult?.id) throw new Error('No se pudo generar el token de Yape');
      const res = await paymentsService.processYape(bookingId, tokenResult.id);
      const { status } = res.data.data ?? (res.data as any);
      if (status === 'approved') onSuccess();
      else setError('El pago fue rechazado. Verifica tu saldo o intenta de nuevo.');
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="flex flex-col gap-3 pt-3 border-t border-ink-100"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <Smartphone size={15} className="text-mishell-600" />
        <p className="text-sm font-semibold text-ink-900">Datos de Yape</p>
      </div>
      <div>
        <label className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide mb-1 block">Número de celular</label>
        <input
          type="tel" inputMode="numeric" placeholder="Ej: 987654321"
          value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} maxLength={9}
          className="w-full border border-ink-100 rounded-xl px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-mishell-600"
        />
      </div>
      <div>
        <label className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide mb-1 block">Código OTP (app Yape)</label>
        <input
          type="text" inputMode="numeric" placeholder="Ej: 123456"
          value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} maxLength={6}
          className="w-full border border-ink-100 rounded-xl px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-mishell-600"
        />
      </div>
      {error && (
        <div className="flex items-start gap-2 bg-mishell-50 rounded-xl p-3">
          <AlertCircle size={14} className="text-mishell-600 shrink-0 mt-0.5" />
          <p className="text-xs text-mishell-700">{error}</p>
        </div>
      )}
      <p className="text-[11px] text-ink-400 bg-ink-50 rounded-xl px-3 py-2">
        <strong>Prueba:</strong> Celular <code>111111111</code> · OTP <code>123456</code>
      </p>
      <Button loading={loading} onClick={handlePay}>
        Pagar ${total.toFixed(0)} con Yape
      </Button>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Step4Confirm({ bookingId, property, onSuccess }: Props) {
  const { checkIn, checkOut, guestData, paymentMethod } = useBookingStore();
  const reset = useBookingStore((s) => s.reset);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showYape, setShowYape] = useState(false);

  const weeks = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (7 * 86400000)))
    : 1;
  const pricePerWeek = property ? Number(property.pricePerWeek) : 0;
  const total = pricePerWeek * weeks;

  const dateRange = checkIn
    ? `${fmt(checkIn)}${checkOut ? ` - ${fmt(checkOut)}` : ''}`
    : '—';

  async function handleConfirm() {
    setError('');

    if (paymentMethod === 'YAPE') {
      setShowYape(true);
      return;
    }

    if (paymentMethod === 'CARD' || paymentMethod === 'MERCADO_PAGO') {
      setLoading(true);
      try {
        const res = await paymentsService.createMpCheckout(bookingId);
        const data = res.data.data ?? (res.data as any);
        const url = IS_SANDBOX ? data.sandboxInitPoint : data.initPoint;
        reset();
        window.location.href = url;
      } catch (err: any) {
        setError(err.response?.data?.message ?? 'Error al iniciar el pago');
        setLoading(false);
      }
      return;
    }

  }

  return (
    <div className="px-5 py-6 flex flex-col gap-5">

      <h2 className="text-xl font-bold text-ink-900">Resumen y confirmación</h2>

      {/* Details card */}
      <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
        {/* Card header */}
        <div className="px-4 py-3 border-b border-ink-100">
          <span className="text-[10px] font-bold tracking-widest text-mishell-600 uppercase">Detalles Finales</span>
        </div>

        {/* ALOJAMIENTO */}
        <div className="px-4 py-3.5 border-b border-ink-100">
          <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-wide mb-1">Alojamiento</p>
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-ink-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-ink-900">{property?.title ?? '—'}</p>
              {property && (
                <p className="text-xs text-ink-500">{property.city}, Lima {property.country}</p>
              )}
            </div>
          </div>
        </div>

        {/* DATOS DEL HUÉSPED */}
        <div className="px-4 py-3.5 border-b border-ink-100">
          <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-wide mb-1">Datos del Huésped</p>
          <div className="flex items-center gap-2">
            <User size={14} className="text-ink-500 shrink-0" />
            <p className="text-sm font-medium text-ink-900">{guestData.name || '—'}</p>
          </div>
        </div>

        {/* FECHAS DE RESERVA */}
        <div className="px-4 py-3.5 border-b border-ink-100">
          <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-wide mb-1">Fechas de Reserva</p>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-ink-500 shrink-0" />
            <p className="text-sm font-medium text-ink-900">{dateRange}</p>
          </div>
        </div>

        {/* Estancia + Precio */}
        <div className="px-4 py-3.5 border-b border-ink-100 flex justify-between">
          <span className="text-sm text-ink-700 font-medium">Estancia</span>
          <span className="text-sm font-semibold text-ink-900">{weeks} {weeks === 1 ? 'semana' : 'semanas'}</span>
        </div>
        <div className="px-4 py-3.5 border-b border-ink-100 flex justify-between">
          <span className="text-sm text-ink-700 font-medium">Precio por semana</span>
          <span className="text-sm font-semibold text-ink-900">${pricePerWeek.toFixed(0)}</span>
        </div>

        {/* Total */}
        <div className="px-4 py-4 flex justify-between items-center">
          <span className="text-sm font-bold text-ink-900">Total a pagar</span>
          <span className="text-2xl font-extrabold text-mishell-600">${total.toFixed(0)}</span>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="flex items-start gap-2 bg-mishell-50 rounded-xl p-3"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <AlertCircle size={14} className="text-mishell-600 shrink-0 mt-0.5" />
            <p className="text-xs text-mishell-700">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Yape form (shown after clicking confirm with Yape) */}
      <AnimatePresence>
        {showYape && (
          <YapeForm bookingId={bookingId} total={total} onSuccess={() => { reset(); onSuccess(); }} />
        )}
      </AnimatePresence>

      {/* Terms */}
      <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 leading-relaxed">
          Al pulsar el botón, aceptas nuestros{' '}
          <span className="underline font-medium">términos de servicio</span>{' '}
          y <span className="underline font-medium">políticas de privacidad</span>.
        </p>
      </div>

      {/* Confirm button */}
      {!showYape && (
        <Button loading={loading} onClick={handleConfirm} className="w-full">
          Confirmar y Reservar
        </Button>
      )}
    </div>
  );
}
