import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Home as HomeIcon, Zap, Lock, MapPin, Building2 } from 'lucide-react';
import { motion } from 'motion/react';
import { PropertyCard } from '../../components/ui/PropertyCard';
import { HorizontalCarousel } from '../../components/ui/HorizontalCarousel';
import { propertiesService } from '../../services/properties.service';
import { useAuthStore } from '../../stores/authStore';

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [section, setSection] = useState('alquileres');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['properties', 'home'],
    queryFn: () => propertiesService.getAll({ limit: 10, status: 'AVAILABLE' }).then((r) => r.data),
    staleTime: 0,
  });

  const { data: recentData, isLoading: recentLoading, isError: recentError } = useQuery({
    queryKey: ['properties', 'recent'],
    queryFn: () =>
      propertiesService
        .getAll({ limit: 20, status: 'AVAILABLE', sortBy: 'createdAt', order: 'desc' })
        .then((r) => r.data),
    staleTime: 0,
  });

  const properties = data?.data ?? [];

  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const recentProperties = (recentData?.data ?? []).filter(
    (p) => new Date(p.createdAt) >= threeDaysAgo,
  );

  return (
    <div className="bg-ink-50 pb-4">
      {/* Sticky header */}
      <div className="bg-white/90 backdrop-blur-md sticky top-0 z-20 border-b border-ink-100/60">
        <div className="px-5 pt-12 pb-4">
          {/* Brand + role row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <img
                src="/images/LogoMishell.png"
                alt="Mishell"
                className="w-9 h-9 rounded-full object-cover border border-ink-100"
              />
              <span className="text-base font-bold text-ink-900">
                {user?.role === 'INQUILINO' ? 'Arrendataria' : 'Mishell Room'}
              </span>
            </div>
          </div>

          {/* Greeting row */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-ink-500 text-xs mb-0.5">
              <MapPin size={11} />
              <span>Lima, Perú</span>
            </div>
            <p className="text-sm text-ink-600">
              Hola, <span className="font-semibold text-ink-900">{user?.firstName}</span> — Encuentra tu próxima habitación
            </p>
          </div>

          {/* Search shortcut */}
          <button
            data-tutorial="search"
            onClick={() => navigate('/properties')}
            className="w-full flex items-center gap-2.5 bg-ink-50 border border-ink-100 rounded-2xl px-4 py-3 text-sm text-ink-400 text-left"
          >
            <Search size={15} className="text-ink-400 shrink-0" />
            Buscar habitaciones en Lima...
          </button>
        </div>

        {/* Section tabs */}
        <div className="px-5 pb-4">
          <div className="flex bg-ink-50 rounded-full p-1 gap-1">
            <button
              onClick={() => setSection('alquileres')}
              className={`flex-1 py-2 rounded-full text-sm font-medium flex items-center justify-center gap-1.5 transition-all ${
                section === 'alquileres'
                  ? 'bg-white text-ink-900 font-semibold shadow-sm'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              <HomeIcon size={14} />
              Alquileres
            </button>
            <div className="flex-1 py-2 rounded-full flex items-center justify-center gap-1.5 text-ink-300 cursor-not-allowed relative">
              <Lock size={11} className="shrink-0" />
              <Zap size={14} className="shrink-0" />
              <span className="text-sm font-medium">Servicios</span>
              <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-mishell-600 text-white px-1.5 py-0.5 rounded-full leading-none">
                Pronto
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-6">
        {/* Disponibles */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-ink-900">Disponibles ahora</h2>
              <p className="text-xs text-ink-500 uppercase tracking-wide">Mejores opciones</p>
            </div>
            <button
              onClick={() => navigate('/properties')}
              className="text-xs font-semibold text-mishell-600 uppercase tracking-wide hover:underline"
            >
              Ver todos
            </button>
          </div>

          {isLoading ? (
            <HorizontalCarousel>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-52 h-48 bg-white rounded-2xl shadow-sm shrink-0 animate-pulse" />
              ))}
            </HorizontalCarousel>
          ) : isError ? (
            <div className="flex flex-col items-center gap-2 py-8 bg-white rounded-2xl border border-ink-100">
              <Building2 size={28} className="text-ink-200" />
              <p className="text-sm text-ink-400">No se pudieron cargar las habitaciones</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 bg-white rounded-2xl border border-ink-100">
              <Building2 size={28} className="text-ink-200" />
              <p className="text-sm text-ink-400">No hay habitaciones disponibles ahora</p>
              <button
                onClick={() => navigate('/properties')}
                className="text-xs font-semibold text-mishell-600 underline"
              >
                Ver todas las propiedades
              </button>
            </div>
          ) : (
            <HorizontalCarousel>
              {properties.slice(0, 6).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + i * 0.07 }}
                >
                  <PropertyCard
                    property={p}
                    compact
                    onClick={() => navigate(`/properties/${p.id}`)}
                  />
                </motion.div>
              ))}
            </HorizontalCarousel>
          )}
        </motion.section>

        {/* Recién publicadas */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-ink-900">Recién publicadas</h2>
              <p className="text-xs text-ink-500 uppercase tracking-wide">Nuevas llegadas</p>
            </div>
            <button
              onClick={() => navigate('/properties')}
              className="text-xs font-semibold text-mishell-600 uppercase tracking-wide hover:underline"
            >
              Ver todos
            </button>
          </div>

          {recentLoading ? (
            <HorizontalCarousel>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-52 h-48 bg-white rounded-2xl shadow-sm shrink-0 animate-pulse" />
              ))}
            </HorizontalCarousel>
          ) : recentError ? (
            <div className="flex flex-col items-center gap-2 py-8 bg-white rounded-2xl border border-ink-100">
              <Building2 size={28} className="text-ink-200" />
              <p className="text-sm text-ink-400">No se pudieron cargar las publicaciones recientes</p>
            </div>
          ) : recentProperties.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 bg-white rounded-2xl border border-ink-100">
              <Building2 size={28} className="text-ink-200" />
              <p className="text-sm text-ink-400">No hay publicaciones nuevas en los últimos 3 días</p>
            </div>
          ) : (
            <HorizontalCarousel>
              {recentProperties.slice(0, 4).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                >
                  <PropertyCard
                    property={p}
                    compact
                    onClick={() => navigate(`/properties/${p.id}`)}
                  />
                </motion.div>
              ))}
            </HorizontalCarousel>
          )}
        </motion.section>
      </div>

    </div>
  );
}
