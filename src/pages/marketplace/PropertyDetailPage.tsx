import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Share2, Heart, Star, MapPin, Wifi, Users, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleMapView } from '../../components/ui/GoogleMapView';
import { AppHeader } from '../../components/layout/AppHeader';
import { propertiesService } from '../../services/properties.service';
import { useAuthStore } from '../../stores/authStore';
import { useBookingStore } from '../../stores/bookingStore';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { AMENITY_ICONS, AMENITY_LABELS } from '../../utils/amenities';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const setProperty = useBookingStore((s) => s.setProperty);
  const toggle = useFavoritesStore((s) => s.toggle);
  const isFav = useFavoritesStore((s) => s.has(id ?? ''));
  const [photoIdx, setPhotoIdx] = useState(0);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesService.getOne(id!).then((r) => r.data),
    enabled: !!id,
  });

  function handleReserve() {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user?.status === 'INACTIVE') return;
    const isDniUser = user?.email?.endsWith('@mishell.room');
    if (isDniUser && user?.verificationStatus !== 'APPROVED') {
      navigate('/verification');
      return;
    }
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

  if (!property) {
    return (
      <div className="flex flex-col bg-white min-h-full items-center justify-center text-ink-400">
        <AppHeader />
        <p>Propiedad no encontrada</p>
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
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-ink-50">
              <Share2 size={18} className="text-ink-900" />
            </button>
            <motion.button
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

      {/* Gallery */}
      <div className="relative h-64 bg-ink-100 overflow-hidden">
        {photos.length > 0 ? (
          <>
            <img
              src={photos[photoIdx]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {photos.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotoIdx(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i === photoIdx ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-ink-400 text-sm">Sin fotos</div>
        )}
      </div>

      {/* Main info */}
      <motion.div
        className="px-5 pt-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-xl font-bold text-ink-900">{property.title}</h1>
          <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
            <Star size={14} className="fill-mishell-600 text-mishell-600" />
            <span className="text-sm font-semibold text-ink-900">4.9</span>
            <span className="text-xs text-ink-600">· 124 reseñas</span>
          </div>
        </div>
        <p className="text-sm text-ink-600 flex items-center gap-1 mt-1">
          <MapPin size={13} /> {property.address}, {property.city}
        </p>
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
        {(property.amenities as string[]).length > 0 && (
          <section>
            <h2 className="text-base font-bold text-ink-900 mb-1">Lo que este lugar ofrece</h2>
            <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
              {(property.amenities as string[]).map((key) => {
                const Icon = AMENITY_ICONS[key] ?? Wifi;
                return (
                  <div key={key} className="flex items-center gap-3 px-4 py-3.5 border-b border-ink-100 last:border-0">
                    <div className="w-9 h-9 rounded-full bg-ink-50 flex items-center justify-center flex-shrink-0">
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
        {(property.restrictions as any[]).length > 0 && (
          <section>
            <h2 className="text-base font-bold text-ink-900 mb-1">Restricciones</h2>
            <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
              {(property.restrictions as any[]).map((r: any) => (
                <div key={r.key} className="flex items-start gap-3 px-4 py-3.5 border-b border-ink-100 last:border-0">
                  <div className="w-9 h-9 rounded-full bg-mishell-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {r.key === 'max_capacity'
                      ? <Users size={16} className="text-mishell-600" />
                      : <XCircle size={16} className="text-mishell-600" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{r.label}</p>
                    <p className="text-xs text-ink-600">{r.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Location map */}
        <section>
          <h2 className="text-base font-bold text-ink-900 mb-1">Ubicación</h2>
          <p className="text-sm text-ink-600 mb-3 flex items-center gap-1">
            <MapPin size={13} /> {property.address}, {property.city}
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
        className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-ink-100 px-5 py-3 z-50"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <motion.button
          onClick={handleReserve}
          className="w-full bg-mishell-600 hover:bg-mishell-500 active:bg-mishell-700 text-white font-semibold rounded-full h-14 text-base transition-colors"
          whileTap={{ scale: 0.97 }}
        >
          Reservar ahora
        </motion.button>
      </motion.div>
    </div>
  );
}
