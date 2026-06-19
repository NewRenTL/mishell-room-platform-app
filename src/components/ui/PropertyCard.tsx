import { Star, MapPin, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import type { Property } from '../../types';
import { useFavoritesStore } from '../../stores/favoritesStore';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
  onClick?: () => void;
}

const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

export function PropertyCard({ property, compact = false, onClick }: PropertyCardProps) {
  const img = property.photoUrls?.[0];
  const toggle = useFavoritesStore((s) => s.toggle);
  const isFav = useFavoritesStore((s) => s.has(property.id));
  const isNew = property.createdAt
    ? Date.now() - new Date(property.createdAt).getTime() < THREE_DAYS
    : false;

  function handleFav(e: React.MouseEvent) {
    e.stopPropagation();
    toggle(property.id);
  }

  if (compact) {
    return (
      <div
        className="w-52 bg-white rounded-2xl shadow-sm overflow-hidden shrink-0 cursor-pointer active:scale-95 transition-transform"
        onClick={onClick}
      >
        <div className="relative h-36">
          {img
            ? <img src={img} alt={property.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-ink-100 flex items-center justify-center text-ink-400 text-xs">Sin foto</div>
          }
          {isNew && (
            <div className="absolute top-2 left-2 bg-mishell-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Nuevo
            </div>
          )}
          <motion.button
            className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm"
            onClick={handleFav}
            whileTap={{ scale: 0.75 }}
            animate={isFav ? { scale: [1, 1.4, 0.9, 1.1, 1] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Heart
              size={14}
              className={isFav ? 'text-mishell-600 fill-mishell-600' : 'text-ink-400'}
            />
          </motion.button>
          <div className="absolute bottom-2 left-2 bg-black/60 rounded-lg px-2 py-0.5 text-white text-xs font-semibold">
            S/ {Number(property.pricePerWeek).toFixed(0)}<span className="font-normal opacity-80">/sem</span>
          </div>
        </div>
        <div className="p-3">
          <p className="text-sm font-semibold text-ink-900 truncate">{property.title}</p>
          <p className="text-xs text-ink-600 flex items-center gap-1 mt-0.5">
            <MapPin size={10} /> {property.city}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
      onClick={onClick}
    >
      <div className="relative h-52">
        {img
          ? <img src={img} alt={property.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-ink-100 flex items-center justify-center text-ink-400 text-sm">Sin foto</div>
        }
        {isNew && (
          <div className="absolute top-3 left-3 bg-mishell-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            Nuevo
          </div>
        )}
        <motion.button
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm"
          onClick={handleFav}
          whileTap={{ scale: 0.75 }}
          animate={isFav ? { scale: [1, 1.4, 0.9, 1.1, 1] } : { scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Heart
            size={16}
            className={isFav ? 'text-mishell-600 fill-mishell-600' : 'text-ink-400'}
          />
        </motion.button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-base font-bold text-ink-900">{property.title}</p>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={13} className="fill-mishell-600 text-mishell-600" />
            <span className="text-sm font-semibold text-ink-900">4.9</span>
          </div>
        </div>
        <p className="text-sm text-ink-600 flex items-center gap-1 mt-1">
          <MapPin size={12} /> {property.city} · {property.rooms} hab. · {property.maxCapacity} pers.
        </p>
        <p className="text-sm font-bold text-ink-900 mt-2">
          S/ {Number(property.pricePerWeek).toFixed(0)}
          <span className="text-ink-600 font-normal"> / semana</span>
        </p>
      </div>
    </div>
  );
}
