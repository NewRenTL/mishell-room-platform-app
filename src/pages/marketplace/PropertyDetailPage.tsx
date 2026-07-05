import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Share2, Heart, Star, MapPin, Wifi, Users, XCircle, X, Expand, Building2, DoorOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleMapView } from '../../components/ui/GoogleMapView';
import { AppHeader } from '../../components/layout/AppHeader';
import { propertiesService } from '../../services/properties.service';
import { useAuthStore } from '../../stores/authStore';
import { useBookingStore } from '../../stores/bookingStore';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { AMENITY_ICONS, AMENITY_LABELS, RESTRICTION_LABELS } from '../../utils/amenities';
import { AuthPromptSheet } from '../../components/ui/AuthPromptSheet';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const setProperty = useBookingStore((s) => s.setProperty);
  const toggle = useFavoritesStore((s) => s.toggle);
  const isFav = useFavoritesStore((s) => s.has(id ?? ''));
  const [photoIdx, setPhotoIdx] = useState(0);
  const [authSheetOpen, setAuthSheetOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const lbTouchX = useRef<number | null>(null);

  const { data: property, isLoading, isError } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesService.getOne(id!).then((r) => r.data),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const [reserveError, setReserveError] = useState('');

  function handleReserve() {
    if (!isAuthenticated) { setAuthSheetOpen(true); return; }
    if (user?.status === 'INACTIVE') { setReserveError('Tu cuenta está pendiente de verificación. No puedes reservar aún.'); return; }
    if (user?.role === 'SOCIO') {
      setReserveError('Los propietarios no pueden reservar habitaciones desde su cuenta.');
      return;
    }
    if (user?.role === 'ADMIN') {
      setReserveError('La cuenta administrativa no puede reservar.');
      return;
    }
    if (user?.verificationStatus !== 'APPROVED') {
      navigate('/verification');
      return;
    }
    // Prefetch the booking flow chunk to make navigation feel instant
    import('../booking/BookingFlowPage').catch(() => {});
    setReserveError('');
    setProperty(id!);
    navigate(`/booking/${id}`);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col bg-white min-h-full">
        <AppHeader />
        <div className="animate-pulse px-5 pt-4 flex flex-col gap-4">
          <div className="h-56 bg-ink-100 rounded-2xl" />
          <div className="h-6 bg-ink-100 rounded w-3/4" />
          <div className="h-4 bg-ink-100 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="flex flex-col bg-white min-h-full items-center justify-center text-ink-400 gap-2">
        <AppHeader />
        <p className="text-sm">{isError ? 'Error al cargar la propiedad.' : 'Propiedad no encontrada.'}</p>
        <button onClick={() => navigate(-1)} className="text-sm font-semibold text-mishell-600">
          Volver
        </button>
      </div>
    );
  }

  const photos = property.photoUrls ?? [];
  const hasMap = !!property.latitude && !!property.longitude;

  return (
    <div className="flex flex-col bg-white min-h-full pb-28">
      <AppHeader
        right={
          <div className="flex items-center gap-1">
            <button aria-label="Compartir" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-ink-50">
              <Share2 size={18} className="text-ink-900" />
            </button>
            <motion.button
              aria-label={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-ink-50"
              onClick={() => toggle(id!)}
              whileTap={{ scale: 0.75 }}
            >
              <Heart
                size={18}
                className={isFav ? 'text-mishell-600 fill-mishell-600' : 'text-ink-900'}
              />
            </motion.button>
          </div>
        }
      />

      {/* ── Gallery (compact preview) ── */}
      <div
        className="relative h-64 bg-ink-100 overflow-hidden cursor-pointer group"
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(delta) > 40) {
            if (delta < 0) setPhotoIdx((i) => Math.min(i + 1, photos.length - 1));
            else setPhotoIdx((i) => Math.max(i - 1, 0));
          } else {
            setLightboxOpen(true);
          }
          touchStartX.current = null;
        }}
        onClick={() => photos.length > 0 && setLightboxOpen(true)}
      >
        {photos.length > 0 ? (
          <>
            <img src={photos[photoIdx]} alt={property.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            {/* Expand hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                <Expand size={13} className="text-white" />
                <span className="text-white text-xs font-medium">Ver foto</span>
              </div>
            </div>
            {photos.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {photos.map((_, i) => (
                  <button key={i} onClick={(e) => { e.stopPropagation(); setPhotoIdx(i); }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === photoIdx ? 'bg-white scale-125' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            )}
            <div className="absolute top-3 right-3 bg-black/40 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
              {photoIdx + 1}/{photos.length}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-ink-400 text-sm">Sin fotos</div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && photos.length > 0 && (
        <motion.div
          className="fixed inset-0 z-9999 bg-black flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-safe pb-3 pt-4 shrink-0">
            <span className="text-white/70 text-sm font-medium">{photoIdx + 1} / {photos.length}</span>
            <button onClick={() => setLightboxOpen(false)} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20">
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Image */}
          <div
            className="flex-1 flex items-center justify-center overflow-hidden px-2"
            onTouchStart={(e) => { lbTouchX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (lbTouchX.current === null) return;
              const delta = e.changedTouches[0].clientX - lbTouchX.current;
              if (Math.abs(delta) > 40) {
                if (delta < 0) setPhotoIdx((i) => Math.min(i + 1, photos.length - 1));
                else setPhotoIdx((i) => Math.max(i - 1, 0));
              }
              lbTouchX.current = null;
            }}
          >
            <motion.img
              key={photoIdx}
              src={photos[photoIdx]}
              alt={property.title}
              className="max-w-full max-h-full object-contain rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18 }}
            />
          </div>

          {/* Dot navigation */}
          {photos.length > 1 && (
            <div className="shrink-0 flex items-center justify-center gap-2 py-4">
              {photos.map((_, i) => (
                <button key={i} onClick={() => setPhotoIdx(i)}
                  className={`rounded-full transition-all ${i === photoIdx ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/40'}`}
                />
              ))}
            </div>
          )}

          {/* Arrow buttons */}
          {photoIdx > 0 && (
            <button onClick={() => setPhotoIdx((i) => i - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl leading-none active:bg-white/20"
            >‹</button>
          )}
          {photoIdx < photos.length - 1 && (
            <button onClick={() => setPhotoIdx((i) => i + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl leading-none active:bg-white/20"
            >›</button>
          )}
        </motion.div>
      )}

      {/* Main info */}
      <motion.div
        className="px-5 pt-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-xl font-bold text-ink-900">{property.title}</h1>
          <div className="flex items-center gap-1 shrink-0 mt-0.5">
            <Star size={14} className="fill-mishell-600 text-mishell-600" />
            <span className="text-sm font-semibold text-ink-900">4.9</span>
            <span className="text-xs text-ink-600">· 124 reseñas</span>
          </div>
        </div>
        <p className="text-sm text-ink-600 flex items-center gap-1 mt-1">
          <MapPin size={13} /> {property.address}{property.district ? `, ${property.district}` : ''}{property.province ? `, ${property.province}` : ''}{property.city ? `, ${property.city}` : ''}
        </p>
        {(property.apartmentName || property.roomNumber) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {property.apartmentName && (
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-700 bg-ink-50 border border-ink-100 rounded-full px-3 py-1">
                <Building2 size={12} className="text-ink-500" />
                {property.apartmentName}
              </span>
            )}
            {property.roomNumber && (
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-700 bg-ink-50 border border-ink-100 rounded-full px-3 py-1">
                <DoorOpen size={12} className="text-ink-500" />
                {property.roomNumber}
              </span>
            )}
          </div>
        )}
      </motion.div>

      <motion.div
        className="px-5 mt-5 flex flex-col gap-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {/* Description */}
        {property.description && (
          <section>
            <h2 className="text-base font-bold text-ink-900 mb-2">Acerca de este alojamiento</h2>
            <p className="text-sm text-ink-600 leading-relaxed">{property.description}</p>
          </section>
        )}

        {/* Amenities */}
        {((property.amenities as string[] | null) ?? []).length > 0 && (
          <section>
            <h2 className="text-base font-bold text-ink-900 mb-1">Lo que este lugar ofrece</h2>
            <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
              {((property.amenities as string[] | null) ?? []).map((key) => {
                const Icon = AMENITY_ICONS[key] ?? Wifi;
                return (
                  <div key={key} className="flex items-center gap-3 px-4 py-3.5 border-b border-ink-100 last:border-0">
                    <div className="w-9 h-9 rounded-full bg-ink-50 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-ink-700" />
                    </div>
                    <span className="text-sm text-ink-900">{AMENITY_LABELS[key] ?? key}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Restrictions */}
        {(property.restrictions?.length ?? 0) > 0 && (
          <section>
            <h2 className="text-base font-bold text-ink-900 mb-1">Restricciones</h2>
            <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
              {((property.restrictions as string[] | null) ?? []).map((key) => (
                <div key={key} className="flex items-center gap-3 px-4 py-3.5 border-b border-ink-100 last:border-0">
                  <div className="w-9 h-9 rounded-full bg-mishell-50 flex items-center justify-center shrink-0">
                    {key === 'max_1_persona'
                      ? <Users size={16} className="text-mishell-600" />
                      : <XCircle size={16} className="text-mishell-600" />
                    }
                  </div>
                  <p className="text-sm font-semibold text-ink-900">{RESTRICTION_LABELS[key] ?? key}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Location map */}
        <section>
          <h2 className="text-base font-bold text-ink-900 mb-1">Ubicación</h2>
          <p className="text-sm text-ink-600 mb-3 flex items-center gap-1">
            <MapPin size={13} />
            {[property.address, property.district, property.province, property.city].filter(Boolean).join(', ')}
          </p>
          {hasMap ? (
            <div className="h-52 rounded-2xl overflow-hidden border border-ink-100">
              <GoogleMapView
                lat={property.latitude!}
                lng={property.longitude!}
                title={property.title}
              />
            </div>
          ) : (
            <div className="h-24 rounded-2xl border border-ink-100 bg-ink-50 flex flex-col items-center justify-center text-ink-400 gap-1">
              <MapPin size={20} />
              <p className="text-xs">{property.address}, {property.city}</p>
            </div>
          )}
        </section>

        {/* Price */}
        <div className="bg-mishell-50 border border-mishell-100 rounded-2xl p-4">
          <p className="text-lg font-bold text-ink-900">
            S/ {Number(property.pricePerWeek).toFixed(0)}
            <span className="text-sm font-normal text-ink-600"> / semana</span>
          </p>
          <p className="text-xs text-ink-600 mt-0.5">{property.rooms} habitación · {property.maxCapacity} personas máx.</p>
        </div>
      </motion.div>

      {/* FAB Reservar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 max-w-107.5 mx-auto bg-white border-t border-ink-100 px-5 py-3 z-50"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {reserveError && (
          <p className="text-xs text-mishell-600 text-center mb-2 px-2">{reserveError}</p>
        )}
        <motion.button
          onClick={handleReserve}
          className="w-full bg-mishell-600 hover:bg-mishell-500 active:bg-mishell-700 text-white font-semibold rounded-full h-14 text-base transition-colors"
          whileTap={{ scale: 0.97 }}
        >
          Reservar ahora
        </motion.button>
      </motion.div>

      <AuthPromptSheet
        open={authSheetOpen}
        onClose={() => setAuthSheetOpen(false)}
        redirectTo={`/properties/${id}`}
        description={`Crea tu cuenta o inicia sesión para reservar "${property.title}".`}
      />
    </div>
  );
}
