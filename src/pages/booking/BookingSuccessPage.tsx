import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, MapPin, Calendar, ArrowRight, Clock, Share2, Download, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toPng } from 'html-to-image';
import { Button } from '../../components/ui/Button';
import { bookingsService } from '../../services/bookings.service';

const WHATSAPP_NUMBER = '51910881880';

function fmt(dateStr: string | null | undefined) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtTime(dateStr: string | null | undefined) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function BookingSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [savingImage, setSavingImage] = useState(false);

  const { data: booking, isError } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsService.getOne(id!).then((r) => r.data),
    enabled: !!id,
  });

  const dateRange = booking
    ? `${fmt(booking.checkIn)}${booking.checkOut ? ` - ${fmt(booking.checkOut)}` : ''}`
    : '—';
  const bookingTime = fmtTime(booking?.createdAt);

  async function handleSaveImage() {
    if (!cardRef.current || !booking) return;
    setSavingImage(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: '#ffffff' });
      // Web Share API con archivo (funciona en móvil)
      if (navigator.canShare) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `comprobante-${booking.referenceId ?? id}.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Comprobante de reserva - Mishell Room' });
          return;
        }
      }
      // Fallback: descarga directa
      const link = document.createElement('a');
      link.download = `comprobante-${booking.referenceId ?? id}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // silencioso — el usuario puede tomar captura manual
    } finally {
      setSavingImage(false);
    }
  }

  function handleShare() {
    if (!booking) return;
    const lines = [
      'Reserva confirmada - Mishell Room',
      '',
      `Propiedad: ${booking.property?.title ?? ''}`,
      `Ubicacion: ${booking.property?.city ?? ''}, Lima ${booking.property?.country ?? ''}`,
      `Fechas: ${dateRange}   Hora: ${bookingTime}`,
      `Total pagado: S/ ${Number(booking.totalAmount).toFixed(0)}`,
    ];
    if (booking.referenceId) lines.push(`ID de reserva: ${booking.referenceId}`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
  }

  if (isError) {
    return (
      <div className="max-w-107.5 mx-auto min-h-dvh bg-white flex flex-col items-center justify-center px-6 text-center gap-4">
        <p className="text-ink-500 text-sm">No se pudo cargar la reserva. Por favor revisa tu perfil.</p>
        <button onClick={() => navigate('/profile')} className="text-sm font-semibold text-mishell-600 underline">
          Ir a mi perfil
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-107.5 mx-auto min-h-dvh bg-white flex flex-col items-center justify-center px-6 text-center gap-6">

      {/* Checkmark */}
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
      >
        {/* Glow */}
        <div className="absolute w-28 h-28 rounded-full bg-green-100 blur-xl opacity-60" />
        <div className="relative w-24 h-24 rounded-full border-4 border-green-500 bg-white flex items-center justify-center">
          <CheckCircle2 size={48} className="text-green-500" strokeWidth={1.8} />
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        <h1 className="text-2xl font-extrabold text-ink-900 leading-tight">
          ¡Tu reserva se<br />realizó con éxito!
        </h1>
        <p className="text-sm text-ink-500 mt-2 leading-relaxed">
          Hemos enviado los detalles a tu correo electrónico.
        </p>
      </motion.div>

      {/* Booking summary card */}
      <motion.div
        ref={cardRef}
        className="w-full bg-white border border-ink-100 rounded-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Card header */}
        <div className="px-4 py-3 border-b border-ink-100 flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-widest text-ink-500 uppercase">Resumen de la reserva</span>
          {booking?.referenceId && (
            <span className="text-[11px] font-bold text-mishell-600">ID: {booking.referenceId}</span>
          )}
        </div>

        {/* Property */}
        <div className="px-4 py-3.5 border-b border-ink-100">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-mishell-50 flex items-center justify-center shrink-0">
              <MapPin size={14} className="text-mishell-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-ink-900">{booking?.property?.title ?? '—'}</p>
              {booking?.property && (
                <p className="text-xs text-ink-500">{booking.property.city}, Lima {booking.property.country}</p>
              )}
            </div>
          </div>
        </div>

        {/* Date + time */}
        <div className="px-4 py-3.5 border-b border-ink-100">
          <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-wide mb-1.5">Fecha</p>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-ink-500 shrink-0" />
              <p className="text-sm font-medium text-ink-900">{dateRange}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-ink-50 px-2 py-0.5 rounded-md">
              <Clock size={12} className="text-ink-500" />
              <p className="text-xs font-semibold text-ink-700">Hora: {bookingTime}</p>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="px-4 py-3.5 flex justify-between items-center">
          <span className="text-sm text-ink-600 font-medium">Total pagado</span>
          <span className="text-lg font-extrabold text-ink-900">
            S/ {booking ? Number(booking.totalAmount).toFixed(0) : '—'}
          </span>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        className="flex flex-col gap-3 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.4 }}
      >
        <Button onClick={handleShare}>
          <Share2 size={16} className="mr-2" />
          Compartir por WhatsApp
        </Button>

        <button
          onClick={handleSaveImage}
          disabled={savingImage || !booking}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-ink-200 bg-white text-ink-700 text-sm font-semibold disabled:opacity-50 active:scale-95 transition-all"
        >
          {savingImage
            ? <><Loader2 size={15} className="animate-spin" /> Generando imagen...</>
            : <><Download size={15} /> Guardar comprobante</>
          }
        </button>

        <p className="text-xs text-ink-500 text-center leading-relaxed px-2">
          Tambien puedes enviar la foto de tu comprobante de pago (Yape, transferencia, etc.) a este mismo numero de WhatsApp.
        </p>

        <button
          onClick={() => navigate('/profile')}
          className="flex items-center justify-center gap-1.5 text-sm font-semibold text-ink-700 py-2 hover:text-ink-900 transition-colors"
        >
          Ir a mi perfil
          <ArrowRight size={15} />
        </button>
      </motion.div>
    </div>
  );
}
