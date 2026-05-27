import { useEffect, useRef, useState } from 'react';
import { MapPin, Calendar, User, AlertCircle, Smartphone, CreditCard, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../../components/ui/Button';
import { paymentsService } from '../../../services/payments.service';
import { useBookingStore } from '../../../stores/bookingStore';
import type { Property } from '../../../types';

function fmt(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface Props {
  bookingId: string;
  property?: Property;
  onSuccess: () => void;
}

// ─── Card inline form (manual tokenization via MP REST API) ─────────────────

const inputClass =
  'w-full border border-ink-100 rounded-xl px-4 py-3 text-sm text-ink-900 bg-white placeholder:text-ink-400 focus:outline-none focus:border-mishell-600 transition-colors';

const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY as string;

async function createMpCardToken(params: {
  cardNumber: string;
  cardholderName: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
  docType: string;
  docNumber: string;
}): Promise<string> {
  const fullYear = params.expirationYear.length === 2
    ? `20${params.expirationYear}`
    : params.expirationYear;

  const response = await fetch(
    `https://api.mercadopago.com/v1/card_tokens?public_key=${MP_PUBLIC_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        card_number: params.cardNumber,
        security_code: params.securityCode,
        expiration_month: parseInt(params.expirationMonth, 10),
        expiration_year: parseInt(fullYear, 10),
        cardholder: {
          name: params.cardholderName,
          identification: {
            type: params.docType,
            number: params.docNumber,
          },
        },
      }),
    },
  );
  const data = await response.json();
  if (!data.id) throw new Error(data.message ?? data.cause?.[0]?.description ?? 'No se pudo tokenizar la tarjeta');
  return data.id as string;
}

function detectMethodFromNumber(cardNumber: string): string {
  const n = cardNumber.replace(/\s/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^5[1-5]|^2[2-7]|^50/.test(n)) return 'master';
  if (/^3[47]/.test(n)) return 'amex';
  if (/^6/.test(n)) return 'elo';
  return 'visa';
}

async function detectCardBin(bin: string): Promise<{ issuerId: string }> {
  try {
    const r = await fetch(
      `https://api.mercadopago.com/v1/payment_methods/search?public_key=${MP_PUBLIC_KEY}&bin=${bin}`,
    );
    const data = await r.json();
    const method = data.results?.[0];
    return { issuerId: method?.issuer?.id?.toString() ?? '' };
  } catch {
    return { issuerId: '' };
  }
}

const IS_SANDBOX = import.meta.env.VITE_IS_SANDBOX !== 'false';

const SANDBOX_CARDS = [
  { brand: 'Mastercard', number: '5031 7557 3453 0604', cvv: '123', expiry: '11/30', method: 'master' },
  { brand: 'Visa',       number: '4009 1753 3280 6176', cvv: '123', expiry: '11/30', method: 'visa'   },
  { brand: 'Amex',       number: '3711 803032 57522',   cvv: '1234', expiry: '11/30', method: 'amex'  },
];

function CardForm({ bookingId, total, onSuccess }: { bookingId: string; total: number; onSuccess: () => void }) {
  const [cardNumber, setCardNumber] = useState(IS_SANDBOX ? '5031 7557 3453 0604' : '');
  const [cardName, setCardName]     = useState(IS_SANDBOX ? 'APRO' : '');
  const [expiry, setExpiry]         = useState(IS_SANDBOX ? '11/30' : '');
  const [cvv, setCvv]               = useState(IS_SANDBOX ? '123' : '');
  const [docType, setDocType]       = useState('DNI');
  const [docNumber, setDocNumber]   = useState(IS_SANDBOX ? '12345678' : '');
  const [email, setEmail]           = useState(IS_SANDBOX ? 'test_user_2361503404@testuser.com' : '');
  const [paymentMethodId, setPaymentMethodId] = useState(IS_SANDBOX ? 'master' : '');
  const [issuerId, setIssuerId]     = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [showInfo, setShowInfo]     = useState(false);

  function handleCardNumber(val: string) {
    const clean = val.replace(/\D/g, '').slice(0, 16);
    setCardNumber(clean.replace(/(.{4})/g, '$1 ').trim());
    setPaymentMethodId(detectMethodFromNumber(clean));
    if (clean.length >= 6) {
      detectCardBin(clean.slice(0, 6)).then(({ issuerId: issId }) => {
        setIssuerId(issId);
      });
    }
  }

  function handleExpiry(val: string) {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    setExpiry(clean.length > 2 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean);
  }

  async function handlePay() {
    if (!cardNumber || !cardName || !expiry || !cvv || !docNumber || !email) {
      setError('Completa todos los campos');
      return;
    }
    const [month, year] = expiry.split('/');
    if (!month || !year || month.length < 2 || year.length < 2) {
      setError('Fecha de vencimiento inválida (MM/AA)');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const tokenId = await createMpCardToken({
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardholderName: cardName,
        expirationMonth: month,
        expirationYear: year,
        securityCode: cvv,
        docType,
        docNumber,
      });
      const res = await paymentsService.processCard(bookingId, {
        token: tokenId,
        paymentMethodId,
        issuerId: issuerId || undefined,
        installments: 1,
        cardholderEmail: email,
        identificationType: docType,
        identificationNumber: docNumber,
      });
      const result = (res.data as any).data ?? res.data;
      if (result.status === 'approved') onSuccess();
      else setError(`Pago no aprobado: ${result.statusDetail ?? result.status}`);
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
      <div className="flex items-center gap-2 mb-1">
        <CreditCard size={15} className="text-mishell-600" />
        <p className="text-sm font-semibold text-ink-900">Datos de tarjeta</p>
        {IS_SANDBOX && (
          <button
            type="button"
            onClick={() => setShowInfo((v) => !v)}
            className="ml-auto flex items-center gap-1 text-[11px] text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-2 py-1"
          >
            <Info size={11} />
            Modo prueba
          </button>
        )}
      </div>

      {IS_SANDBOX && showInfo && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex flex-col gap-2 text-[11px] text-blue-800">
          <p className="font-semibold text-blue-700">Datos de prueba (sandbox)</p>
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-blue-500 text-left">
                <th className="pb-1 pr-2">Marca</th>
                <th className="pb-1 pr-2">Número</th>
                <th className="pb-1 pr-2">CVV</th>
                <th className="pb-1">Vence</th>
              </tr>
            </thead>
            <tbody>
              {SANDBOX_CARDS.map((c) => (
                <tr key={c.brand} className="cursor-pointer hover:bg-blue-100 rounded"
                  onClick={() => {
                    handleCardNumber(c.number);
                    setCvv(c.cvv);
                    setExpiry(c.expiry);
                    setPaymentMethodId(c.method);
                    setShowInfo(false);
                  }}
                >
                  <td className="py-0.5 pr-2 font-medium">{c.brand}</td>
                  <td className="py-0.5 pr-2 font-mono">{c.number}</td>
                  <td className="py-0.5 pr-2 font-mono">{c.cvv}</td>
                  <td className="py-0.5 font-mono">{c.expiry}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-blue-200 pt-2 flex flex-col gap-1">
            <p><strong>Nombre:</strong> <code>APRO</code> (aprobado) · <code>OTHE</code> (rechazado) · <code>FUND</code> (sin fondos)</p>
            <p><strong>Email:</strong> debe terminar en <code>@testuser.com</code></p>
            <p className="text-blue-500">Click en una fila para autocompletar la tarjeta</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <input className={inputClass} placeholder="Número de tarjeta *" inputMode="numeric"
          value={cardNumber} onChange={(e) => handleCardNumber(e.target.value)} />

        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} placeholder="MM/AA *" inputMode="numeric"
            value={expiry} onChange={(e) => handleExpiry(e.target.value)} />
          <input className={inputClass} placeholder="CVV *" inputMode="numeric" maxLength={4}
            value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} />
        </div>

        <input className={inputClass} placeholder="Nombre en la tarjeta *"
          value={cardName} onChange={(e) => setCardName(e.target.value.toUpperCase())} />

        <div className="grid grid-cols-2 gap-3">
          <select className={inputClass} value={docType} onChange={(e) => setDocType(e.target.value)}>
            <option value="DNI">DNI</option>
            <option value="CE">C. Extranjería</option>
            <option value="PP">Pasaporte</option>
          </select>
          <input className={inputClass} placeholder="Nro. documento *" inputMode="numeric"
            value={docNumber} onChange={(e) => setDocNumber(e.target.value.replace(/\D/g, ''))} />
        </div>

        <input className={inputClass} placeholder="Email *" type="email" inputMode="email"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        {error && (
          <div className="flex items-start gap-2 bg-mishell-50 rounded-xl p-3">
            <AlertCircle size={14} className="text-mishell-600 shrink-0 mt-0.5" />
            <p className="text-xs text-mishell-700">{error}</p>
          </div>
        )}

        <Button loading={loading} onClick={handlePay}>
          Pagar S/ {total.toFixed(2)} con tarjeta
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Yape inline form ────────────────────────────────────────────────────────

function YapeForm({ bookingId, total, onSuccess }: { bookingId: string; total: number; onSuccess: () => void }) {
  const [phone, setPhone] = useState(IS_SANDBOX ? '111111111' : '');
  const [otp, setOtp]     = useState(IS_SANDBOX ? '123456' : '');
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
        {IS_SANDBOX && (
          <span className="ml-auto text-[10px] bg-blue-50 text-blue-600 border border-blue-100 rounded-lg px-2 py-1 flex items-center gap-1">
            <Info size={10} /> Modo prueba — campos pre-rellenados
          </span>
        )}
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
      <Button loading={loading} onClick={handlePay}>
        Pagar S/ {total.toFixed(0)} con Yape
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
  const [showYape] = useState(paymentMethod === 'YAPE');
  const [showCard] = useState(paymentMethod === 'CARD');

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
