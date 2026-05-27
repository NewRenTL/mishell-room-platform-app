import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import { AppHeader } from '../../components/layout/AppHeader';
import { bookingsService } from '../../services/bookings.service';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  CONTRACT_PENDING: 'Contrato pendiente',
  CONTRACT_SIGNED: 'Contrato firmado',
  PAYMENT_PENDING: 'Pago pendiente',
  CONFIRMED: 'Confirmada',
  ACTIVE: 'Activa',
  OVERDUE: 'En mora',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-ink-100 text-ink-700',
  CONTRACT_PENDING: 'bg-amber-100 text-amber-700',
  CONTRACT_SIGNED: 'bg-blue-100 text-blue-700',
  PAYMENT_PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-mishell-100 text-mishell-700',
  ACTIVE: 'bg-green-100 text-green-700',
  OVERDUE: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-ink-100 text-ink-500',
  CANCELLED: 'bg-red-100 text-red-700',
};

const FILTERS = ['Todas', 'Activas', 'Completadas', 'Canceladas'];

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Todas');

  const { data, isLoading } = useQuery({
    queryKey: ['bookings', 'mine'],
    queryFn: () => bookingsService.getMine({ limit: 50 }).then((r) => r.data),
  });

  const all = data?.data ?? [];
  const filtered = all.filter((b) => {
    if (filter === 'Activas')    return ['CONFIRMED', 'ACTIVE', 'CONTRACT_PENDING', 'CONTRACT_SIGNED', 'PAYMENT_PENDING'].includes(b.status);
    if (filter === 'Completadas') return b.status === 'COMPLETED';
    if (filter === 'Canceladas')  return b.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="flex flex-col min-h-full bg-ink-50">
      <div className="bg-white">
        <AppHeader title="Mis Reservas" />
        <div className="flex gap-2 px-5 pb-4 overflow-x-auto scrollbar-none">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors
                ${filter === f ? 'bg-mishell-600 text-white' : 'bg-white border border-ink-100 text-ink-700'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-5 py-4 flex flex-col gap-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-2xl animate-pulse" />
            ))
          : filtered.length === 0
            ? (
              <div className="flex flex-col items-center justify-center py-16 text-ink-400 gap-3">
                <Calendar size={40} />
                <p className="text-sm">No tienes reservas {filter !== 'Todas' ? `en "${filter}"` : 'aún'}</p>
              </div>
            )
            : filtered.map((booking) => (
              <button
                key={booking.id}
                onClick={() => navigate(`/my-bookings/${booking.id}`)}
                className="w-full bg-white rounded-2xl border border-ink-100 p-4 text-left flex gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-bold text-ink-900 truncate">{booking.property?.title ?? 'Propiedad'}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[booking.status] ?? 'bg-ink-100 text-ink-700'}`}>
                      {STATUS_LABELS[booking.status] ?? booking.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-ink-600 mb-1">
                    <MapPin size={11} />
                    <span>{booking.property?.city ?? '—'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-ink-500">
                    <span className="flex items-center gap-1"><Calendar size={11} />{booking.checkIn?.split('T')[0]}</span>
                    {booking.checkOut && <span>→ {booking.checkOut.split('T')[0]}</span>}
                  </div>
                  <p className="text-sm font-semibold text-mishell-600 mt-2">S/ {Number(booking.totalAmount).toFixed(0)}</p>
                </div>
                <ChevronRight size={18} className="text-ink-300 flex-shrink-0 mt-1" />
              </button>
            ))
        }

        {filtered.length === 0 && !isLoading && filter === 'Todas' && (
          <button
            onClick={() => navigate('/properties')}
            className="mt-4 w-full h-14 rounded-full bg-mishell-600 text-white font-semibold text-base"
          >
            Explorar habitaciones
          </button>
        )}
      </div>
    </div>
  );
}
