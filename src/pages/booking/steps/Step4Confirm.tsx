import { useEffect, useRef, useState } from 'react';
import { MapPin, Calendar, User, AlertCircle, Smartphone, CreditCard, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../../components/ui/Button';
import { paymentsService } from '../../../services/payments.service';
import { useBookingStore } from '../../../stores/bookingStore';
import type { Property } from '../../../types';
import type { CardPaymentPayload } from '../../../services/payments.service';

function fmt(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface Props {
  bookingId: string;
  property?: Property;
  onSuccess: () => void;
}

// ─── Card inline form ────────────────────────────────────────────────────────

const iframeInputClass =
  'w-full border border-ink-100 rounded-xl px-4 py-3 text-sm text-ink-900 bg-white focus-within:border-mishell-600 transition-colors overflow-hidden';

function CardForm({ bookingId, total, onSuccess }: { bookingId: string; total: number; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const cardFormRef = useRef<any>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    let scriptEl: HTMLScriptElement | null = null;

    function initCardForm() {
      if (mountedRef.current) return;
      mountedRef.current = true;

      const mp = new (window as any).MercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: 'es-PE' });

      cardFormRef.current = mp.cardForm({
        amount: total.toString(),
        iframe: true,
        form: {
          id: 'mp-card-form',
          cardNumber: { id: 'mp-card-number', placeholder: '•••• •••• •••• ••••' },
          expirationDate: { id: 'mp-card-expiry', placeholder: 'MM/AA' },
          securityCode: { id: 'mp-card-cvv', placeholder: 'CVV' },
          cardholderName: { id: 'mp-card-name', placeholder: 'Nombre en la tarjeta' },
          issuer: { id: 'mp-card-issuer', placeholder: 'Banco emisor' },
          installments: { id: 'mp-card-installments', placeholder: 'Cuotas' },
          identificationType: { id: 'mp-card-id-type', placeholder: 'Tipo doc' },
          identificationNumber: { id: 'mp-card-id-number', placeholder: 'Número documento' },
          cardholderEmail: { id: 'mp-card-email', placeholder: 'Email' },
        },
        callbacks: {
          onFormMounted: (err: any) => {
            if (err) console.error('[MP CardForm mount]', err);
          },
          onSubmit: async (event: any) => {
            event.preventDefault();
            setLoading(true);
            setError('');
            try {
              const data = cardFormRef.current.getCardFormData() as CardPaymentPayload & { cardholderEmail: string };
              if (!data.token) throw new Error('No se pudo tokenizar la tarjeta');
              const res = await paymentsService.processCard(bookingId, {
                token: data.token,
                paymentMethodId: data.paymentMethodId,
                issuerId: data.issuerId,
                installments: Number(data.installments) || 1,
                cardholderEmail: data.cardholderEmail,
                identificationType: data.identificationType,
                identificationNumber: data.identificationNumber,
              });
              const result = (res.data as any).data ?? res.data;
              if (result.status === 'approved') {
                onSuccess();
              } else {
                setError(`Pago no aprobado (${result.statusDetail ?? result.status}). Verifica los datos.`);
              }
            } catch (err: any) {
              setError(err.response?.data?.message ?? err.message ?? 'Error al procesar el pago');
            } finally {
              setLoading(false);
            }
          },
          onError: (errors: any[]) => {
            console.error('[MP CardForm errors]', errors);
          },
        },
      });
    }

    if ((window as any).MercadoPago) {
      initCardForm();
    } else {
      scriptEl = document.createElement('script');
      scriptEl.src = 'https://sdk.mercadopago.com/js/v2';
      scriptEl.async = true;
      scriptEl.onload = initCardForm;
      document.head.appendChild(scriptEl);
    }

    return () => {
      mountedRef.current = false;
      if (cardFormRef.current) {
        try { cardFormRef.current.unmount(); } catch { /* ignore */ }
        cardFormRef.current = null;
      }
      if (scriptEl && document.head.contains(scriptEl)) {
        document.head.removeChild(scriptEl);
      }
    };
  }, []);

  return (
    <motion.div
      className="flex flex-col gap-3 pt-3 border-t border-ink-100"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-1">
        <CreditCard size={15} className="text-mishell-600" />
        <p className="text-sm font-semibold text-ink-900">Datos de tarjeta</p>
      </div>
      <form id="mp-card-form" className="flex flex-col gap-3">
        <div>
          <label className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide mb-1 block">Número de tarjeta</label>
          <div id="mp-card-number" className={iframeInputClass} style={{ height: 46 }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide mb-1 block">Vencimiento</label>
            <div id="mp-card-expiry" className={iframeInputClass} style={{ height: 46 }} />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide mb-1 block">CVV</label>
            <div id="mp-card-cvv" className={iframeInputClass} style={{ height: 46 }} />
          </div>
        </div>
        <div>
          <label className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide mb-1 block">Nombre del titular</label>
          <div id="mp-card-name" className={iframeInputClass} style={{ height: 46 }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide mb-1 block">Tipo documento</label>
            <div id="mp-card-id-type" className={iframeInputClass} style={{ height: 46 }} />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide mb-1 block">Nro. documento</label>
            <div id="mp-card-id-number" className={iframeInputClass} style={{ height: 46 }} />
          </div>
        </div>
        <div>
          <label className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide mb-1 block">Email</label>
          <div id="mp-card-email" className={iframeInputClass} style={{ height: 46 }} />
        </div>
        <div style={{ display: 'none' }}>
          <div id="mp-card-issuer" />
          <div id="mp-card-installments" />
        </div>
        {error && (
          <div className="flex items-start gap-2 bg-mishell-50 rounded-xl p-3">
            <AlertCircle size={14} className="text-mishell-600 shrink-0 mt-0.5" />
            <p className="text-xs text-mishell-700">{error}</p>
          </div>
        )}
        <p className="text-[11px] text-ink-400 bg-ink-50 rounded-xl px-3 py-2">
          <strong>Prueba:</strong> Visa <code>4009175332806176</code> · CVV <code>123</code> · Venc. <code>11/25</code>
        </p>
        <Button type="submit" loading={loading}>
          Pagar S/ {total.toFixed(2)} con tarjeta
        </Button>
      </form>
    </motion.div>
  );
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
  const [showCard, setShowCard] = useState(false);

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

    if (paymentMethod === 'CARD') {
      setShowCard(true);
      return;
    }

    if (paymentMethod === 'MERCADO_PAGO') {
      setLoading(true);
      try {
        const res = await paymentsService.createMpCheckout(bookingId);
        const data = (res.data as any).data ?? res.data;
        const isSandbox = import.meta.env.VITE_IS_SANDBOX !== 'false';
        const url = isSandbox ? data.sandboxInitPoint : data.initPoint;
        reset();
        window.location.href = url;
      } catch (err: any) {
        setError(err.response?.data?.message ?? 'Error al iniciar el pago con MercadoPago');
        setLoading(false);
      }
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

      {/* Card form */}
      <AnimatePresence>
        {showCard && (
          <CardForm bookingId={bookingId} total={total} onSuccess={() => { reset(); onSuccess(); }} />
        )}
      </AnimatePresence>

      {/* Yape form */}
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
      {!showYape && !showCard && (
        <Button loading={loading} onClick={handleConfirm} className="w-full">
          Confirmar y Reservar
        </Button>
      )}
    </div>
  );
}
