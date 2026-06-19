import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';
import { AppHeader } from '../../components/layout/AppHeader';
import { PropertyCard } from '../../components/ui/PropertyCard';
import { propertiesService } from '../../services/properties.service';

const CITIES = ['Todas', 'Lima', 'Arequipa', 'Cusco', 'Trujillo'];

export default function MarketplacePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['properties', { search, city, page }],
    queryFn: () =>
      propertiesService.getAll({ search: search || undefined, city: city || undefined, page, limit: 10, status: 'AVAILABLE' })
        .then((r) => r.data),
  });

  const properties = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  return (
    <div className="flex flex-col min-h-full bg-ink-50">
      <div className="bg-white sticky top-0 z-20">
        <AppHeader title="Habitaciones disponibles" />
        <div className="px-5 pb-4">
          <p className="text-xs text-ink-600 text-center -mt-1 mb-3">Encuentra tu próximo hogar ideal</p>

          {/* Barra de búsqueda */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              className="w-full border border-ink-100 rounded-xl pl-10 pr-4 py-3 text-sm text-ink-900 bg-white placeholder:text-ink-400 focus:outline-none focus:border-mishell-600"
              placeholder="Buscar habitaciones..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          {/* Filtros ciudad */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
            {CITIES.map((c) => {
              const val = c === 'Todas' ? '' : c;
              return (
                <button
                  key={c}
                  onClick={() => { setCity(val); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors
                    ${city === val ? 'bg-mishell-600 text-white' : 'bg-white border border-ink-100 text-ink-700'}`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 px-5 py-4 flex flex-col gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-full h-52 bg-white rounded-2xl animate-pulse" />
            ))
          : properties.length === 0
            ? (
              <div className="flex flex-col items-center justify-center py-16 text-ink-400">
                <Search size={40} className="mb-3" />
                <p className="text-sm">No encontramos propiedades con esos filtros</p>
              </div>
            )
            : properties.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                >
                  <PropertyCard
                    property={p}
                    onClick={() => navigate(`/properties/${p.id}`)}
                  />
                </motion.div>
              ))
        }

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 rounded-full text-sm font-medium border border-ink-100 disabled:opacity-40"
            >
              ← Anterior
            </button>
            <span className="px-4 py-2 text-sm text-ink-600">{page} / {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-full text-sm font-medium border border-ink-100 disabled:opacity-40"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
