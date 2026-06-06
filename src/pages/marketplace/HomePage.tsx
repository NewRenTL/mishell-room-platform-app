import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bell, Search, Home as HomeIcon, Zap, Smile, MapPin, Building2 } from 'lucide-react';
import { motion } from 'motion/react';
import { PropertyCard } from '../../components/ui/PropertyCard';
import { TabSwitcher } from '../../components/ui/TabSwitcher';
import { HorizontalCarousel } from '../../components/ui/HorizontalCarousel';
import { PageTutorial } from '../../components/ui/PageTutorial';
import { propertiesService } from '../../services/properties.service';
import { useAuthStore } from '../../stores/authStore';

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [section, setSection] = useState('alquileres');

  const { data, isLoading } = useQuery({
    queryKey: ['properties', 'home'],
    queryFn: () => propertiesService.getAll({ limit: 10, status: 'AVAILABLE' }).then((r) => r.data),
  });

  const { data: recentData, isLoading: recentLoading } = useQuery({
    queryKey: ['properties', 'recent'],
    queryFn: () =>
      propertiesService
        .getAll({ limit: 20, status: 'AVAILABLE', sortBy: 'createdAt', order: 'desc' })
        .then((r) => r.data),
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
          {/* Greeting row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-ink-500 text-xs mb-1">
                <MapPin size={11} />
                <span>Lima, Perú</span>
              </div>
              <h1 className="text-xl font-bold text-ink-900 leading-tight">
                {user ? (
                  <span className="flex items-center gap-2">
                    <Smile size={18} className="text-mishell-600 shrink-0" />
                    Hola, {user.firstName}
                  </span>
                ) : (
                  'Mishell Room'
                )}
              </h1>
              <p className="text-xs text-ink-500 mt-0.5">Encuentra tu próximo hogar</p>
            </div>
            <button
              onClick={() => navigate('/home')}
              className="w-9 h-9 rounded-full bg-ink-50 border border-ink-100 flex items-center justify-center relative"
            >
              <Bell size={17} className="text-ink-600" />
            </button>
          </div>

          {/* Search shortcut */}
          <button
            onClick={() => navigate('/properties')}
            className="w-full flex items-center gap-2.5 bg-ink-50 border border-ink-100 rounded-2xl px-4 py-3 text-sm text-ink-400 text-left"
          >
            <Search size={15} className="text-ink-400 shrink-0" />
            Buscar habitaciones en Lima...
          </button>
        </div>

        {/* Section tabs */}
        <div className="px-5 pb-4">
          <TabSwitcher
            tabs={[
              { key: 'alquileres', label: 'Alquileres', icon: <HomeIcon size={14} /> },
              { key: 'servicios',  label: 'Servicios',  icon: <Zap size={14} /> },
            ]}
            active={section}
            onChange={setSection}
          />
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

      <PageTutorial
        id="home"
        steps={[
          { title: 'Bienvenido a Mishell Room', content: 'Aquí encontrarás habitaciones disponibles para alquilar. Explora las opciones y reserva la que más te guste.' },
          { title: 'Disponibles ahora', content: 'Esta sección muestra habitaciones listas para reservar hoy. Desliza horizontalmente para ver más opciones.' },
          { title: 'Recién publicadas', content: 'Habitaciones añadidas en los últimos 3 días. ¡Sé de los primeros en verlas y reservar!' },
          { title: 'Guardar favoritos', content: 'Toca el corazón ❤️ en cualquier habitación para guardarla. Puedes revisar tus favoritos cuando quieras.' },
          { title: 'Buscar y filtrar', content: 'Toca la barra de búsqueda para filtrar por ciudad, precio o número de habitaciones. Encuentra exactamente lo que necesitas.' },
        ]}
      />
    </div>
  );
}
