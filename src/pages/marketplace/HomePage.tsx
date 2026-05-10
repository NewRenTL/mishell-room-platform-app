import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bell, Search, Home as HomeIcon, Zap, Smile, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { PropertyCard } from '../../components/ui/PropertyCard';
import { TabSwitcher } from '../../components/ui/TabSwitcher';
import { HorizontalCarousel } from '../../components/ui/HorizontalCarousel';
import { propertiesService } from '../../services/properties.service';
import { useAuthStore } from '../../stores/authStore';

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [section, setSection] = useState('alquileres');

  const { data } = useQuery({
    queryKey: ['properties', 'home'],
    queryFn: () => propertiesService.getAll({ limit: 10 }).then((r) => r.data),
  });

  const properties = data?.data ?? [];

  return (
    <div className="bg-ink-50 pb-4">
      {/* Sticky header */}
      <div className="bg-white sticky top-0 z-20 shadow-sm">
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
                    <Smile size={18} className="text-mishell-600 flex-shrink-0" />
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
            <Search size={15} className="text-ink-400 flex-shrink-0" />
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

          <HorizontalCarousel>
            {properties.length === 0
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-52 h-48 bg-white rounded-2xl shadow-sm flex-shrink-0 animate-pulse" />
                ))
              : properties.slice(0, 6).map((p, i) => (
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
                ))
            }
          </HorizontalCarousel>
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

          <HorizontalCarousel>
            {properties.slice(0, 4).map((p, i) => (
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
        </motion.section>
      </div>
    </div>
  );
}
