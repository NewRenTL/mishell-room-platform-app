import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Banknote, Calendar, CheckCircle2, Clock, XCircle, AlertTriangle,
  LogOut, ChevronDown, ChevronUp, Smartphone, ArrowLeftRight, Coins,
  Camera, X, Loader2, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppHeader } from '../../components/layout/AppHeader';
import { weeklyPaymentsService } from '../../services/weekly-payments.service';
import type { BookingWithPayments, WeeklyPayment } from '../../types';

const STATUS_CONFIG = {
  PENDING:   { label: 'Pendiente',   color: 'bg-amber-100 text-amber-700',  icon: Clock },
  PAID:      { label: 'En revisión', color: 'bg-blue-100 text-blue-700',    icon: CheckCircle2 },
  APPROVED:  { label: 'Aprobado',    color: 'bg-green-100 text-green-700',  icon: CheckCircle2 },
  REJECTED:  { label: 'Rechazado',   color: 'bg-red-100 text-red-700',      icon: XCircle },
  CANCELLED: { label: 'Cancelado',   color: 'bg-ink-100 text-ink-500',      icon: XCircle },
};

const BOOKING_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  CONFIRMED: { label: 'Confirmada', color: 'bg-mishell-100 text-mishell-700' },
  ACTIVE:    { label: 'Activa',     color: 'bg-green-100 text-green-700'    },
  OVERDUE:   { label: 'En mora',    color: 'bg-red-100 text-red-700'        },
};

type PaymentMethod = 'YAPE' | 'TRANSFERENCIA' | 'EFECTIVO';

const METHOD_OPTIONS: { id: PaymentMethod; label: string; subtitle: string; icon: React.ReactNode; needsVoucher: boolean }[] = [
  { id: 'YAPE',         label: 'Yape',           subtitle: 'Adjunta captura del comprobante',  icon: <Smartphone size={20} className="text-purple-600" />, needsVoucher: true },
  { id: 'TRANSFERENCIA',label: 'Transferencia',  subtitle: 'Adjunta captura del comprobante',  icon: <ArrowLeftRight size={20} className="text-blue-600" />,   needsVoucher: true },
  { id: 'EFECTIVO',     label: 'Efectivo',        subtitle: 'Sin comprobante requerido',        icon: <Coins size={20} className="text-green-600" />,           needsVoucher: false },
];

// ─── Payment method bottom sheet ─────────────────────────────────────────────

function PaymentSheet({
  payment,
  onClose,
  onSubmit,
  submitting,
}: {
  payment: WeeklyPayment;
  onClose: () => void;
  onSubmit: (method: PaymentMethod, voucherKey?: string) => void;
  submitting: boolean;
}) {
  const [step, setStep] = useState<'method' | 'voucher'>('method');
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [voucherFile, setVoucherFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function pickMethod(m: PaymentMethod) {
    const opt = METHOD_OPTIONS.find((o) => o.id === m)!;
    setMethod(m);
    if (opt.needsVoucher) {
      setStep('voucher');
    } else {
      onSubmit(m);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setVoucherFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleConfirm() {
    if (!method) return;
    if (voucherFile) {
      setUploading(true);
      try {
        const { data } = await weeklyPaymentsService.uploadVoucher(payment.id, voucherFile);
        onSubmit(method, data.key);
      } finally {
        setUploading(false);
      }
    } else {
      onSubmit(method);
    }
  }

  const isRejected = payment.status === 'REJECTED';

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="relative bg-white rounded-t-3xl px-5 pt-4 pb-8 flex flex-col gap-4"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-ink-200 rounded-full self-center mb-1" />

        {/* Rejection notice */}
        {isRejected && payment.rejectionReason && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
            <XCircle size={14} className="text-red-600 mt-0.5 shrink-0" />
            <p className="text-xs text-red-700">
              <span className="font-semibold">Motivo de rechazo: </span>{payment.rejectionReason}
            </p>
          </div>
        )}

        {step === 'method' ? (
          <>
            <div>
              <p className="text-base font-bold text-ink-900">
                {isRejected ? 'Reenviar pago' : 'Registrar pago'}
              </p>
              <p className="text-xs text-ink-500 mt-0.5">
                Semana {payment.weekNumber} · S/ {Number(payment.amount).toFixed(0)}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {METHOD_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => pickMethod(opt.id)}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-ink-100 bg-ink-50 active:scale-98 transition-transform text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-ink-100 shrink-0">
                    {opt.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink-900">{opt.label}</p>
                    <p className="text-[11px] text-ink-500">{opt.subtitle}</p>
                  </div>
                  <ChevronRight size={16} className="text-ink-300" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <button onClick={() => setStep('method')} className="text-ink-500 hover:text-ink-700">
                <X size={18} />
              </button>
              <div>
                <p className="text-base font-bold text-ink-900">Adjuntar comprobante</p>
                <p className="text-xs text-ink-500">
                  {method === 'YAPE' ? 'Captura de Yape' : 'Captura de transferencia'}
                </p>
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative">
                <img src={previewUrl} alt="Comprobante" className="w-full max-h-52 object-contain rounded-xl border border-ink-100" />
                <button
                  onClick={() => { setPreviewUrl(null); setVoucherFile(null); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 border border-ink-100 flex items-center justify-center"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center gap-2 py-8 border-2 border-dashed border-ink-200 rounded-2xl text-ink-500 active:border-mishell-400 transition-colors"
              >
                <Camera size={28} />
                <span className="text-xs font-medium">Tomar foto o seleccionar imagen</span>
              </button>
            )}

            <button
              onClick={handleConfirm}
              disabled={submitting || uploading || !previewUrl}
              className="w-full py-3.5 bg-mishell-600 text-white font-semibold text-sm rounded-2xl disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              {submitting || uploading
                ? <><Loader2 size={16} className="animate-spin" /> Enviando...</>
                : 'Confirmar pago'}
            </button>

            <button
              onClick={() => method && onSubmit(method)}
              disabled={submitting || uploading}
              className="text-xs text-ink-400 text-center hover:text-ink-600 transition-colors disabled:opacity-40"
            >
              Continuar sin comprobante
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ─── Payment row ──────────────────────────────────────────────────────────────

function PaymentRow({ payment, onOpenSheet }: {
  payment: WeeklyPayment;
  onOpenSheet: (p: WeeklyPayment) => void;
}) {
  const cfg = STATUS_CONFIG[payment.status] ?? STATUS_CONFIG.PENDING;
  const Icon = cfg.icon;
  const canPay = payment.status === 'PENDING' || payment.status === 'REJECTED';

  return (
    <div className="flex items-center justify-between py-3 border-b border-ink-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${cfg.color}`}>
          <Icon size={14} />
        </div>
        <div>
          <p className="text-xs font-semibold text-ink-900">Semana {payment.weekNumber}</p>
          <p className="text-[10px] text-ink-500">
            Vence {new Date(payment.dueDate).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
          </p>
          {payment.voucherMethod && payment.status === 'PAID' && (
            <p className="text-[10px] text-blue-600 mt-0.5">Vía {payment.voucherMethod.charAt(0) + payment.voucherMethod.slice(1).toLowerCase()}</p>
          )}
          {payment.rejectionReason && (
            <p className="text-[10px] text-red-600 mt-0.5">Motivo: {payment.rejectionReason}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="text-right">
          <p className="text-sm font-bold text-ink-900">S/ {Number(payment.amount).toFixed(0)}</p>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
        {canPay && (
          <button
            onClick={() => onOpenSheet(payment)}
            className="ml-1 px-3 py-1.5 bg-mishell-600 text-white text-xs font-semibold rounded-xl active:scale-95 transition-transform"
          >
            {payment.status === 'REJECTED' ? 'Reenviar' : 'Pagar'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Booking card ─────────────────────────────────────────────────────────────

function BookingCard({ booking, onOpenSheet, onDeparture }: {
  booking: BookingWithPayments;
  onOpenSheet: (p: WeeklyPayment) => void;
  onDeparture: (bookingId: string, date: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [showDeparture, setShowDeparture] = useState(false);
  const [departureDate, setDepartureDate] = useState('');

  const bCfg = BOOKING_STATUS_CONFIG[booking.status];
  const today = new Date().toISOString().split('T')[0];
  const hasPending = booking.weeklyPayments.some((p) => p.status === 'PENDING' || p.status === 'REJECTED');

  return (
    <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-bold text-ink-900 leading-tight">{booking.property.title}</p>
          {bCfg && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${bCfg.color}`}>
              {bCfg.label}
            </span>
          )}
        </div>
        <p className="text-xs text-ink-500">{booking.property.address}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-ink-600">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            Desde {new Date(booking.checkIn).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
          <span>S/ {Number(booking.totalAmount).toFixed(0)} / {booking.paymentFrequencyDays === 7 ? 'semana' : `${booking.paymentFrequencyDays} días`}</span>
        </div>

        {booking.departureNoticeDate ? (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg">
            <LogOut size={11} />
            Salida notificada: {new Date(booking.departureNoticeDate).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        ) : (
          <div className="mt-2">
            {!showDeparture ? (
              <button
                onClick={() => setShowDeparture(true)}
                className="flex items-center gap-1 text-xs text-ink-500 hover:text-mishell-600 transition-colors"
              >
                <LogOut size={11} />
                Notificar fecha de salida
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={departureDate}
                  min={today}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="text-xs border border-ink-200 rounded-lg px-2 py-1.5 flex-1 focus:outline-none focus:border-mishell-500"
                />
                <button
                  onClick={() => { if (departureDate) { onDeparture(booking.id, departureDate); setShowDeparture(false); } }}
                  disabled={!departureDate}
                  className="px-3 py-1.5 bg-mishell-600 text-white text-xs font-semibold rounded-lg disabled:opacity-40"
                >
                  Confirmar
                </button>
                <button onClick={() => setShowDeparture(false)} className="text-xs text-ink-500">×</button>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => setExpanded((x) => !x)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-ink-50 border-t border-ink-100 text-xs font-semibold text-ink-700"
      >
        <span className="flex items-center gap-1.5">
          <Banknote size={13} />
          {booking.weeklyPayments.length} {booking.weeklyPayments.length === 1 ? 'pago' : 'pagos'}
          {hasPending && <span className="w-2 h-2 bg-amber-500 rounded-full" />}
        </span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && (
        <div className="px-4">
          {booking.weeklyPayments.length === 0 ? (
            <p className="text-xs text-ink-400 text-center py-4">No hay pagos generados aún</p>
          ) : (
            booking.weeklyPayments.map((p) => (
              <PaymentRow key={p.id} payment={p} onOpenSheet={onOpenSheet} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyPaymentsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [sheetPayment, setSheetPayment] = useState<WeeklyPayment | null>(null);
  const LIMIT = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['my-payments', page],
    queryFn: () => weeklyPaymentsService.getMyPayments({ page, limit: LIMIT }).then((r) => r.data),
  });

  const markPaid = useMutation({
    mutationFn: ({ id, method, voucherKey }: { id: string; method: string; voucherKey?: string }) =>
      weeklyPaymentsService.markPaid(id, { voucherMethod: method, voucherKey }),
    onSuccess: () => {
      setSheetPayment(null);
      queryClient.invalidateQueries({ queryKey: ['my-payments'] });
    },
  });

  const setDeparture = useMutation({
    mutationFn: ({ bookingId, date }: { bookingId: string; date: string }) =>
      weeklyPaymentsService.setDepartureNotice(bookingId, date),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-payments'] }),
  });

  const bookings = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col min-h-full bg-ink-50">
      <AppHeader title="Mis Pagos" />

      <div className="px-5 py-4 flex flex-col gap-3">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-48 bg-white rounded-2xl animate-pulse" />
          ))
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-ink-400 gap-3">
            <Banknote size={40} />
            <p className="text-sm text-center">
              No tienes pagos activos.
              <br />
              Cuando el administrador confirme tu reserva, aparecerán aquí.
            </p>
          </div>
        ) : (
          <>
            {bookings.some((b) => b.status === 'OVERDUE') && (
              <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl">
                <AlertTriangle size={16} className="text-red-600 shrink-0" />
                <p className="text-xs text-red-700 font-medium">
                  Tienes pagos vencidos. Por favor, regulariza tu situación para evitar inconvenientes.
                </p>
              </div>
            )}
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onOpenSheet={setSheetPayment}
                onDeparture={(bookingId, date) => setDeparture.mutate({ bookingId, date })}
              />
            ))}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-ink-200 text-ink-700 disabled:opacity-40"
                >
                  Anterior
                </button>
                <span className="text-xs text-ink-500">{page} / {meta.totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page === meta.totalPages}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-ink-200 text-ink-700 disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {sheetPayment && (
          <PaymentSheet
            payment={sheetPayment}
            onClose={() => setSheetPayment(null)}
            onSubmit={(method, voucherKey) =>
              markPaid.mutate({ id: sheetPayment.id, method, voucherKey })
            }
            submitting={markPaid.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
