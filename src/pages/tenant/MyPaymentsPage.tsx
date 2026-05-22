import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Banknote, Calendar, CheckCircle2, Clock, XCircle, AlertTriangle, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import { AppHeader } from '../../components/layout/AppHeader';
import { weeklyPaymentsService } from '../../services/weekly-payments.service';
import type { BookingWithPayments, WeeklyPayment } from '../../types';

const STATUS_CONFIG = {
  PENDING:   { label: 'Pendiente',  color: 'bg-amber-100 text-amber-700',  icon: Clock },
  PAID:      { label: 'En revisión', color: 'bg-blue-100 text-blue-700',   icon: CheckCircle2 },
  APPROVED:  { label: 'Aprobado',   color: 'bg-green-100 text-green-700',  icon: CheckCircle2 },
  REJECTED:  { label: 'Rechazado',  color: 'bg-red-100 text-red-700',      icon: XCircle },
  CANCELLED: { label: 'Cancelado',  color: 'bg-ink-100 text-ink-500',      icon: XCircle },
};

const BOOKING_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  CONFIRMED: { label: 'Confirmada',  color: 'bg-mishell-100 text-mishell-700' },
  ACTIVE:    { label: 'Activa',      color: 'bg-green-100 text-green-700'    },
  OVERDUE:   { label: 'En mora',     color: 'bg-red-100 text-red-700'        },
};

function PaymentRow({ payment, onPay, paying }: {
  payment: WeeklyPayment;
  onPay: (id: string) => void;
  paying: boolean;
}) {
  const cfg = STATUS_CONFIG[payment.status] ?? STATUS_CONFIG.PENDING;
  const Icon = cfg.icon;
  const canPay = payment.status === 'PENDING' || payment.status === 'REJECTED';

  return (
    <div className="flex items-center justify-between py-3 border-b border-ink-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
          <Icon size={14} />
        </div>
        <div>
          <p className="text-xs font-semibold text-ink-900">Semana {payment.weekNumber}</p>
          <p className="text-[10px] text-ink-500">Vence {new Date(payment.dueDate).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}</p>
          {payment.rejectionReason && (
            <p className="text-[10px] text-red-600 mt-0.5">Motivo: {payment.rejectionReason}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-right">
          <p className="text-sm font-bold text-ink-900">S/ {Number(payment.amount).toFixed(0)}</p>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
        {canPay && (
          <button
            onClick={() => onPay(payment.id)}
            disabled={paying}
            className="ml-1 px-3 py-1.5 bg-mishell-600 text-white text-xs font-semibold rounded-xl disabled:opacity-50 active:scale-95 transition-transform"
          >
            {paying ? '...' : 'Pagar'}
          </button>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking, onPay, payingId, onDeparture }: {
  booking: BookingWithPayments;
  onPay: (id: string) => void;
  payingId: string | null;
  onDeparture: (bookingId: string, date: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [showDeparture, setShowDeparture] = useState(false);
  const [departureDate, setDepartureDate] = useState('');

  const bCfg = BOOKING_STATUS_CONFIG[booking.status];
  const today = new Date().toISOString().split('T')[0];

  const hasPending = booking.weeklyPayments.some(
    (p) => p.status === 'PENDING' || p.status === 'REJECTED',
  );

  return (
    <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
      {/* Booking header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-bold text-ink-900 leading-tight">{booking.property.title}</p>
          {bCfg && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${bCfg.color}`}>
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

        {/* Departure notice */}
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

      {/* Payments toggle */}
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
              <PaymentRow
                key={p.id}
                payment={p}
                onPay={onPay}
                paying={payingId === p.id}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function MyPaymentsPage() {
  const queryClient = useQueryClient();
  const [payingId, setPayingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['my-payments'],
    queryFn: () => weeklyPaymentsService.getMyPayments().then((r) => r.data.data),
  });

  const markPaid = useMutation({
    mutationFn: (id: string) => {
      setPayingId(id);
      return weeklyPaymentsService.markPaid(id);
    },
    onSettled: () => {
      setPayingId(null);
      queryClient.invalidateQueries({ queryKey: ['my-payments'] });
    },
  });

  const setDeparture = useMutation({
    mutationFn: ({ bookingId, date }: { bookingId: string; date: string }) =>
      weeklyPaymentsService.setDepartureNotice(bookingId, date),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-payments'] }),
  });

  const bookings = data ?? [];

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
                <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
                <p className="text-xs text-red-700 font-medium">
                  Tienes pagos vencidos. Por favor, regulariza tu situación para evitar inconvenientes.
                </p>
              </div>
            )}
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onPay={(id) => markPaid.mutate(id)}
                payingId={payingId}
                onDeparture={(bookingId, date) => setDeparture.mutate({ bookingId, date })}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
