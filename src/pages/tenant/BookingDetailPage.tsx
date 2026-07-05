import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin, FileText, ChevronRight,
  BedDouble, Users, Navigation, Download, Loader2,
} from 'lucide-react';
import { getApiErrorMessage } from '../../utils/error';
import { motion } from 'motion/react';
import { AppHeader } from '../../components/layout/AppHeader';
import { bookingsService } from '../../services/bookings.service';
import { AMENITY_LABELS } from '../../utils/amenities';

const STATUS_LABELS: Record<string, string> = {
  PENDING:          'Pendiente',
  CONTRACT_PENDING: 'Contrato pendiente',
  CONTRACT_SIGNED:  'Contrato firmado',
  PAYMENT_PENDING:  'Pago pendiente',
  CONFIRMED:        'Confirmada',
  ACTIVE:           'Activa',
  OVERDUE:          'En mora',
  COMPLETED:        'Completada',
  CANCELLED:        'Cancelada',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:          'bg-ink-100 text-ink-700',
  CONTRACT_PENDING: 'bg-amber-100 text-amber-700',
  CONTRACT_SIGNED:  'bg-blue-100 text-blue-700',
  PAYMENT_PENDING:  'bg-amber-100 text-amber-700',
  CONFIRMED:        'bg-mishell-100 text-mishell-700',
  ACTIVE:           'bg-green-100 text-green-700',
  OVERDUE:          'bg-red-100 text-red-700',
  COMPLETED:        'bg-ink-100 text-ink-500',
  CANCELLED:        'bg-red-100 text-red-700',
};

const PAYMENT_LABELS: Record<string, string> = {
  CARD:         'Tarjeta',
  MERCADO_PAGO: 'Mercado Pago',
  YAPE:         'Yape',
};

function fmt(dateStr: string | null | undefined) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-ink-50 last:border-0 gap-4">
      <p className="text-xs text-ink-400 font-medium shrink-0">{label}</p>
      <p className="text-sm font-semibold text-ink-900 text-right">{value}</p>
    </div>
  );
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const { data: booking, isLoading, isError } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsService.getOne(id!).then((r) => r.data),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });

  async function handleDownloadPdf() {
    if (!id || downloading) return;
    setDownloading(true);
    setDownloadError('');
    // Open the tab synchronously so mobile / Capacitor browsers don't block the popup
    const newTab = window.open('about:blank', '_blank');
    try {
      const { data } = await bookingsService.getContractDownloadUrl(id);
      const url = data.url;
      if (!url) throw new Error('No se pudo obtener la URL del PDF');
      if (newTab && !newTab.closed) {
        newTab.location.href = url;
      } else {
        window.location.href = url;
      }
    } catch (err: unknown) {
      newTab?.close();
      setDownloadError(getApiErrorMessage(err, 'No se pudo generar el PDF. Intenta de nuevo.'));
    } finally {
      setDownloading(false);
    }
  }

  const property = booking?.property;
  const amenities: string[] = Array.isArray(property?.amenities) ? property.amenities : [];

  const mapUrl = property?.latitude && property?.longitude
    ? `https://maps.google.com/?q=${property.latitude},${property.longitude}`
    : property?.address
      ? `https://maps.google.com/?q=${encodeURIComponent(`${property.address}, ${property.city}`)}`
      : null;

  return (
    <div className="flex flex-col min-h-full bg-ink-50">
      <AppHeader title="Detalle de reserva" />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-mishell-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : isError ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
          <p className="text-sm text-ink-400">No se pudo cargar la reserva.</p>
          <button onClick={() => navigate('/my-bookings')} className="text-sm font-semibold text-mishell-600">
            Volver a mis reservas
          </button>
        </div>
      ) : !booking ? (
        <div className="flex-1 flex items-center justify-center text-ink-400 text-sm">
          Reserva no encontrada
        </div>
      ) : (
        <motion.div
          className="px-5 py-5 flex flex-col gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Status + Reference */}
          <div className="bg-white rounded-2xl border border-ink-100 p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-ink-400 font-semibold uppercase tracking-wide mb-1">ID de reserva</p>
              <p className="text-sm font-bold text-ink-900">{booking.referenceId}</p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[booking.status] ?? 'bg-ink-100 text-ink-700'}`}>
              {STATUS_LABELS[booking.status] ?? booking.status}
            </span>
          </div>

          {/* Property */}
          <div className="bg-white rounded-2xl border border-ink-100 p-4 flex flex-col gap-3">
            <p className="text-[10px] text-ink-400 font-semibold uppercase tracking-wide">Propiedad</p>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-mishell-50 flex items-center justify-center shrink-0">
                <MapPin size={16} className="text-mishell-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink-900">{property?.title ?? '—'}</p>
                <p className="text-xs text-ink-500 mt-0.5">{property?.address}, {property?.city}</p>
              </div>
            </div>

            {/* Rooms + capacity */}
            <div className="flex items-center gap-2 flex-wrap">
              {property?.rooms != null && (
                <span className="flex items-center gap-1 text-xs text-ink-700 bg-ink-50 px-2.5 py-1 rounded-full border border-ink-100">
                  <BedDouble size={11} className="text-ink-500" />
                  {property.rooms} hab.
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-ink-700 bg-ink-50 px-2.5 py-1 rounded-full border border-ink-100">
                <Users size={11} className="text-ink-500" />
                {(property?.maxCapacity ?? 1) > 1 ? `${property?.maxCapacity} personas` : '1 persona'}
              </span>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {amenities.map((a) => (
                  <span key={a} className="text-[10px] text-mishell-700 bg-mishell-50 px-2 py-0.5 rounded-full border border-mishell-100 font-medium">
                    {AMENITY_LABELS[a] ?? a}
                  </span>
                ))}
              </div>
            )}

            {/* Map */}
            {mapUrl && (
              <button
                onClick={() => window.open(mapUrl, '_blank')}
                className="flex items-center gap-2 text-xs font-semibold text-mishell-600 bg-mishell-50 border border-mishell-100 rounded-xl px-3 py-2 self-start active:scale-95 transition-transform"
              >
                <Navigation size={12} />
                Ver en mapa
              </button>
            )}
          </div>

          {/* Dates */}
          <div className="bg-white rounded-2xl border border-ink-100 px-4">
            <InfoRow label="Fecha de ingreso" value={fmt(booking.checkIn)} />
            {booking.checkOut && (
              <InfoRow label="Fecha de salida" value={fmt(booking.checkOut)} />
            )}
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-ink-100 px-4">
            <InfoRow label="Total" value={`S/ ${Number(booking.totalAmount).toFixed(0)}`} />
            {property?.pricePerWeek != null && (
              <InfoRow label="Precio por semana" value={`S/ ${Number(property.pricePerWeek).toFixed(0)}`} />
            )}
            {booking.paymentMethod && (
              <InfoRow label="Método de pago" value={PAYMENT_LABELS[booking.paymentMethod] ?? booking.paymentMethod} />
            )}
          </div>

          {/* Contract */}
          {booking.contract && (
            <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
              {/* Navigate to sign / view */}
              <button
                onClick={() => navigate(`/booking/${id}/contract`)}
                className="w-full p-4 flex items-center gap-3 text-left"
              >
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink-900">Contrato de arrendamiento</p>
                  <p className="text-xs text-ink-500 mt-0.5">
                    {booking.contract.status === 'SIGNED' ? 'Firmado' : 'Pendiente de firma'}
                  </p>
                </div>
                <ChevronRight size={16} className="text-ink-300 shrink-0" />
              </button>

              {/* Download PDF — only when signed */}
              {booking.contract.status === 'SIGNED' && (
                <div className="px-4 pb-4 flex flex-col gap-2">
                  <button
                    onClick={handleDownloadPdf}
                    disabled={downloading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-60 active:scale-95 transition-all"
                  >
                    {downloading
                      ? <><Loader2 size={14} className="animate-spin" /> Generando enlace...</>
                      : <><Download size={14} /> Descargar PDF firmado</>
                    }
                  </button>
                  {downloadError && (
                    <p className="text-xs text-mishell-600 text-center">{downloadError}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Back */}
          <button
            onClick={() => navigate('/my-bookings')}
            className="text-sm font-semibold text-ink-500 py-3 text-center hover:text-ink-700 transition-colors"
          >
            Volver a mis reservas
          </button>
        </motion.div>
      )}
    </div>
  );
}
