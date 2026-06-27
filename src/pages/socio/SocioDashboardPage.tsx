import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Home, TrendingUp, Calendar, ChevronRight, ArrowRight, MapPin, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { propertiesService } from '../../services/properties.service';
import { bookingsService } from '../../services/bookings.service';
import { useAuthStore } from '../../stores/authStore';

const STATUS_CHIP: Record<string, string> = {
  AVAILABLE:       'bg-emerald-100 text-emerald-700',
  OCCUPIED:        'bg-blue-100 text-blue-700',
  MAINTENANCE:     'bg-amber-100 text-amber-700',
  PENDING_APPROVAL:'bg-ink-100 text-ink-500',
};
const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: 'Disponible', OCCUPIED: 'Ocupada',
  MAINTENANCE: 'Mantenimiento', PENDING_APPROVAL: 'Pendiente',
};

const stagger = (i: number) => ({ delay: 0.08 + i * 0.07, duration: 0.4 });

export default function SocioDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [propsPage, setPropsPage] = useState(1);
  const PROPS_LIMIT = 10;

  const { data: propsData, isLoading: loadingProps } = useQuery({
    queryKey: ['properties', 'mine', propsPage],
    queryFn: () => propertiesService.getMine({ page: propsPage, limit: PROPS_LIMIT }).then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  });

  const properties = propsData?.data ?? [];
  const propsMeta = propsData?.meta;

  const { data: stats } = useQuery({
    queryKey: ['socio-stats'],
    queryFn: () => bookingsService.getSocioStats().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  });

  return (
    <div className="flex flex-col bg-ink-50 min-h-full pb-6">

      {/* ── Header ── */}
      <motion.div
        className="bg-white px-5 pt-12 pb-5 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-xs text-ink-500">Panel de propietario</p>
              <span className="text-[10px] font-semibold text-ink-600 bg-ink-100 border border-ink-200 px-1.5 py-0.5 rounded-full">
                Socio
              </span>
            </div>
            <h1 className="text-xl font-bold text-ink-900">
              Hola, {user?.firstName} 👋
            </h1>
          </div>
          <motion.button
            onClick={() => navigate('/socio/add-property')}
            className="w-9 h-9 rounded-full bg-mishell-600 flex items-center justify-center shadow-md shadow-mishell-600/30"
            whileTap={{ scale: 0.9 }}
          >
            <Plus size={18} className="text-white" />
          </motion.button>
        </div>
      </motion.div>

      <div className="px-5 mt-5 flex flex-col gap-5">

        {/* ── Stats ── */}
        <div className="flex flex-col gap-3">

          {/* Big earnings card */}
          <motion.div
            className="relative bg-mishell-600 rounded-3xl p-5 overflow-hidden"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {/* decorative circles */}
            <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
            <div className="absolute top-8 -right-2 w-16 h-16 bg-white/10 rounded-full" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <span className="text-white/80 text-sm font-medium">Ingresos totales</span>
              </div>
              <p className="text-white text-3xl font-bold tracking-tight">
                S/ {(stats?.totalRevenue ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 0 })}
              </p>
              <p className="text-white/60 text-xs mt-1">Acumulado de reservas no canceladas</p>
            </div>
          </motion.div>

          {/* 3 small stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Home,     label: 'Propiedades',      value: stats?.totalProperties ?? properties.length, color: 'text-violet-600', bg: 'bg-violet-50' },
              { icon: Calendar, label: 'Activas',           value: stats?.activeBookings  ?? 0,                color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: Calendar, label: 'Total reservas',   value: stats?.totalBookings   ?? 0,                color: 'text-blue-600',    bg: 'bg-blue-50' },
            ].map(({ icon: Icon, label, value, color, bg }, i) => (
              <motion.div
                key={label}
                className="bg-white rounded-2xl p-3.5 border border-ink-100 flex flex-col gap-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={stagger(i)}
              >
                <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={15} className={color} />
                </div>
                <div>
                  <p className="text-xl font-bold text-ink-900 leading-none">{value}</p>
                  <p className="text-[10px] text-ink-500 mt-0.5 leading-tight">{label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Buscar como inquilino ── */}
        <motion.button
          onClick={() => navigate('/home')}
          className="w-full bg-white border border-ink-100 rounded-2xl p-4 flex items-center gap-3 text-left"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 bg-mishell-50 rounded-xl flex items-center justify-center shrink-0">
            <Search size={18} className="text-mishell-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink-900">Buscar habitaciones</p>
            <p className="text-xs text-ink-500">También podés alquilar como inquilino</p>
          </div>
          <ChevronRight size={16} className="text-ink-300 shrink-0" />
        </motion.button>

        {/* ── Properties ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-ink-900">Mis propiedades</h2>
            <motion.button
              onClick={() => navigate('/socio/add-property')}
              className="flex items-center gap-1.5 bg-mishell-600 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm shadow-mishell-600/30 active:bg-mishell-700"
              whileTap={{ scale: 0.96 }}
            >
              <Plus size={13} />
              Nueva propiedad
            </motion.button>
          </div>

          {loadingProps ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <motion.div
              className="bg-white border border-ink-100 rounded-2xl p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-14 h-14 bg-ink-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Home size={24} className="text-ink-300" />
              </div>
              <p className="text-sm text-ink-600 mb-4">Aún no tienes propiedades publicadas</p>
              <button
                onClick={() => navigate('/socio/add-property')}
                className="px-6 py-2.5 rounded-full bg-mishell-600 text-white text-sm font-semibold"
              >
                Publicar primera propiedad
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-3">
              {properties.map((p, i) => (
                <motion.button
                  key={p.id}
                  onClick={() => navigate(`/socio/properties/${p.id}`)}
                  className="w-full bg-white border border-ink-100 rounded-2xl overflow-hidden text-left flex"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={stagger(i)}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Photo */}
                  <div className="w-24 h-24 shrink-0 bg-ink-100">
                    {p.photoUrls?.[0]
                      ? <img src={p.photoUrls[0]} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Home size={20} className="text-ink-300" /></div>
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 px-3 py-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-sm font-bold text-ink-900 leading-tight truncate">{p.title}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${STATUS_CHIP[p.status] ?? 'bg-ink-100 text-ink-600'}`}>
                          {STATUS_LABEL[p.status] ?? p.status}
                        </span>
                      </div>
                      <p className="text-xs text-ink-500 flex items-center gap-0.5 mt-0.5 truncate">
                        <MapPin size={10} /> {p.city}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm font-bold text-mishell-600">S/ {Number(p.pricePerWeek).toFixed(0)}<span className="text-xs font-normal text-ink-500">/sem</span></p>
                      <span className="w-7 h-7 rounded-full bg-mishell-50 flex items-center justify-center shrink-0">
                        <ArrowRight size={14} className="text-mishell-600" />
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
              {propsMeta && propsMeta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    onClick={() => setPropsPage((p) => Math.max(1, p - 1))}
                    disabled={propsPage === 1}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-ink-200 text-ink-700 disabled:opacity-40"
                  >
                    Anterior
                  </button>
                  <span className="text-xs text-ink-500">{propsPage} / {propsMeta.totalPages}</span>
                  <button
                    onClick={() => setPropsPage((p) => Math.min(propsMeta.totalPages, p + 1))}
                    disabled={propsPage === propsMeta.totalPages}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-ink-200 text-ink-700 disabled:opacity-40"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
