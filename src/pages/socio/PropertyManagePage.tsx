import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPin, Users, TrendingUp, Calendar, Trash2, Save, ImagePlus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppHeader } from '../../components/layout/AppHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { GoogleMapPicker } from '../../components/ui/GoogleMapPicker';
import { propertiesService } from '../../services/properties.service';
import { bookingsService } from '../../services/bookings.service';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-ink-100 text-ink-700',
  CONTRACT_PENDING: 'bg-amber-100 text-amber-700',
  CONTRACT_SIGNED: 'bg-blue-100 text-blue-700',
  PAYMENT_PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-mishell-100 text-mishell-700',
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  COMPLETED: 'bg-ink-100 text-ink-500',
  CANCELLED: 'bg-red-100 text-red-700',
};
const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendiente', CONTRACT_PENDING: 'Contrato pend.', CONTRACT_SIGNED: 'Firmado',
  PAYMENT_PENDING: 'Pago pend.', CONFIRMED: 'Confirmada', ACTIVE: 'Activa',
  COMPLETED: 'Completada', CANCELLED: 'Cancelada',
};

const PROP_STATUSES = [
  { key: 'AVAILABLE',   label: 'Disponible',    color: 'bg-emerald-600' },
  { key: 'OCCUPIED',    label: 'Ocupada',        color: 'bg-blue-600' },
  { key: 'MAINTENANCE', label: 'Mantenimiento',  color: 'bg-amber-600' },
];

const CITIES = ['Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Piura', 'Chiclayo'];
const AMENITY_OPTIONS = [
  { key: 'wifi',    label: 'Wifi rápido' },
  { key: 'tv_hd',  label: 'TV HD' },
  { key: 'ac',     label: 'Aire acond.' },
  { key: 'cafetera', label: 'Cafetera' },
];

type Tab = 'reservas' | 'editar';

export default function PropertyManagePage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<Tab>('reservas');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
  const [changingStatus, setChangingStatus] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesService.getOne(id!).then((r) => r.data),
    enabled: !!id,
  });

  const { data: bookingsData } = useQuery({
    queryKey: ['bookings', 'property', id],
    queryFn: () => bookingsService.getByProperty(id!, { limit: 50 }).then((r) => r.data),
    enabled: !!id,
  });

  const bookings = bookingsData?.data ?? [];
  const revenue = bookings.filter((b) => b.status !== 'CANCELLED').reduce((s, b) => s + Number(b.totalAmount), 0);

  const [form, setForm] = useState<{
    title: string; description: string; address: string; city: string;
    pricePerWeek: string; rooms: string; maxCapacity: string; amenities: string[];
  } | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  if (property && !form) {
    setForm({
      title: property.title,
      description: property.description ?? '',
      address: property.address,
      city: property.city,
      pricePerWeek: String(property.pricePerWeek),
      rooms: String(property.rooms),
      maxCapacity: String(property.maxCapacity),
      amenities: (property.amenities as string[]) ?? [],
    });
    if (property.latitude != null && property.longitude != null) {
      setCoords({ lat: property.latitude, lng: property.longitude });
    }
  }

  function setField<K extends keyof NonNullable<typeof form>>(key: K, val: NonNullable<typeof form>[K]) {
    setForm((f) => f ? { ...f, [key]: val } : f);
  }
  function toggleAmenity(key: string) {
    if (!form) return;
    setField('amenities', form.amenities.includes(key)
      ? form.amenities.filter((k) => k !== key)
      : [...form.amenities, key]);
  }

  async function handleSave() {
    if (!form || !id) return;
    setSaving(true); setSaveError('');
    try {
      await propertiesService.update(id, {
        title: form.title, description: form.description || undefined,
        address: form.address, city: form.city,
        pricePerWeek: Number(form.pricePerWeek),
        rooms: Number(form.rooms), maxCapacity: Number(form.maxCapacity),
        amenities: form.amenities,
        latitude:  coords?.lat,
        longitude: coords?.lng,
      });
      qc.invalidateQueries({ queryKey: ['property', id] });
    } catch (err: any) {
      setSaveError(err.response?.data?.message ?? 'Error al guardar');
    } finally { setSaving(false); }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    setUploadingPhoto(true);
    try {
      await propertiesService.addPhoto(id, file);
      qc.invalidateQueries({ queryKey: ['property', id] });
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDeletePhoto(photoId: string) {
    if (!id) return;
    setDeletingPhotoId(photoId);
    try {
      await propertiesService.deletePhoto(id, photoId);
      qc.invalidateQueries({ queryKey: ['property', id] });
    } finally { setDeletingPhotoId(null); }
  }

  async function handleStatusChange(status: string) {
    if (!id) return;
    setChangingStatus(true);
    try {
      await propertiesService.changeStatus(id, status);
      qc.invalidateQueries({ queryKey: ['property', id] });
      qc.invalidateQueries({ queryKey: ['properties', 'mine'] });
      setStatusSuccess(true);
      setTimeout(() => setStatusSuccess(false), 2000);
    } finally { setChangingStatus(false); }
  }

  if (isLoading) {
    return (
      <div className="max-w-[430px] mx-auto min-h-dvh bg-white flex flex-col">
        <AppHeader title="Propiedad" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-mishell-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const photos = property?.photos ?? [];
  const photoUrls = property?.photoUrls ?? [];

  return (
    <div className="max-w-[430px] mx-auto flex flex-col min-h-dvh bg-ink-50">
      <AppHeader title={property?.title ?? 'Propiedad'} />

      {/* Hero photo */}
      <motion.div
        className="h-44 bg-ink-200 overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {photoUrls[0]
          ? <img src={photoUrls[0]} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-ink-400 text-sm">Sin foto</div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-white text-base font-bold leading-tight truncate">{property?.title}</p>
          <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5"><MapPin size={10} />{property?.address}, {property?.city}</p>
        </div>
      </motion.div>

      {/* Quick stats row */}
      <motion.div
        className="bg-white px-4 py-3 flex border-b border-ink-100 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
      >
        {[
          { icon: Calendar, label: 'Reservas', value: bookings.length },
          { icon: Users,    label: 'Activas',  value: bookings.filter((b) => ['CONFIRMED', 'ACTIVE'].includes(b.status)).length },
          { icon: TrendingUp, label: 'Ingresos', value: `S/ ${revenue.toFixed(0)}` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-0.5">
            <Icon size={14} className="text-mishell-600" />
            <p className="text-base font-bold text-ink-900 leading-none">{value}</p>
            <p className="text-[9px] text-ink-500 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Tab bar */}
      <div className="bg-white border-b border-ink-100 flex">
        {(['reservas', 'editar'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-semibold capitalize relative transition-colors
              ${tab === t ? 'text-mishell-600' : 'text-ink-500'}`}
          >
            {t === 'reservas' ? 'Reservas' : 'Editar'}
            {tab === t && (
              <motion.div layoutId="ptab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-mishell-600" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ─── RESERVAS TAB ─── */}
        {tab === 'reservas' && (
          <motion.div
            key="reservas"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4 px-5 py-4 pb-10"
          >
            {/* Status change */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-ink-700 uppercase tracking-wide">Estado del departamento</p>
                <AnimatePresence>
                  {statusSuccess && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1 text-xs text-emerald-600 font-semibold"
                    >
                      <CheckCircle2 size={13} /> Guardado
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex gap-2">
                {PROP_STATUSES.map(({ key, label, color }) => {
                  const isActive = property?.status === key;
                  return (
                    <motion.button
                      key={key}
                      onClick={() => !isActive && handleStatusChange(key)}
                      disabled={changingStatus || isActive}
                      className={`flex-1 py-2.5 rounded-2xl text-xs font-semibold border-2 transition-all
                        ${isActive
                          ? `${color} text-white border-transparent shadow-sm`
                          : 'bg-white text-ink-600 border-ink-100 hover:border-ink-200'}`}
                      whileTap={{ scale: 0.96 }}
                    >
                      {changingStatus && !isActive ? '...' : label}
                    </motion.button>
                  );
                })}
              </div>
            </section>

            {/* Booking history */}
            <section>
              <p className="text-xs font-semibold text-ink-700 uppercase tracking-wide mb-3">
                Historial de reservas ({bookings.length})
              </p>
              {bookings.length === 0 ? (
                <div className="bg-white border border-ink-100 rounded-2xl p-8 text-center">
                  <Calendar size={32} className="text-ink-300 mx-auto mb-2" />
                  <p className="text-sm text-ink-500">Sin reservas aún</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {bookings.map((b, i) => (
                    <motion.div
                      key={b.id}
                      className="bg-white border border-ink-100 rounded-2xl p-4"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-bold text-ink-900">
                            {b.tenant?.firstName} {b.tenant?.lastName ?? ''}
                          </p>
                          <p className="text-xs text-ink-500">#{b.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[b.status] ?? 'bg-ink-100 text-ink-700'}`}>
                          {STATUS_LABEL[b.status] ?? b.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-ink-500 mb-2">
                        <span className="flex items-center gap-1"><Calendar size={10} /> {b.checkIn?.split('T')[0]}</span>
                        {b.checkOut && <span>→ {b.checkOut.split('T')[0]}</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-mishell-600">S/ {Number(b.totalAmount).toFixed(0)}</p>
                        {b.tenant?.phone && (
                          <p className="text-xs text-ink-400">{b.tenant.phone}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </motion.div>
        )}

        {/* ─── EDITAR TAB ─── */}
        {tab === 'editar' && (
          <motion.div
            key="editar"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5 px-5 py-4 pb-28"
          >
            {/* Photos */}
            <section>
              <h2 className="text-sm font-bold text-ink-900 mb-3">Fotos ({photos.length})</h2>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, i) => (
                  <motion.div
                    key={photo.id}
                    className="relative aspect-square rounded-xl overflow-hidden bg-ink-100"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <img src={photoUrls[i]} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      disabled={deletingPhotoId === photo.id}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center"
                    >
                      {deletingPhotoId === photo.id
                        ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                        : <Trash2 size={11} className="text-white" />
                      }
                    </button>
                  </motion.div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="aspect-square rounded-xl border-2 border-dashed border-ink-200 flex flex-col items-center justify-center gap-1 bg-white hover:border-mishell-400 transition-colors"
                >
                  {uploadingPhoto
                    ? <div className="w-5 h-5 border-2 border-mishell-600 border-t-transparent rounded-full animate-spin" />
                    : <><ImagePlus size={20} className="text-ink-400" /><span className="text-[10px] text-ink-400">Añadir</span></>
                  }
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </div>
            </section>

            {form && (
              <>
                <section>
                  <h2 className="text-sm font-bold text-ink-900 mb-3">Información básica</h2>
                  <div className="flex flex-col gap-3">
                    <Input placeholder="Título *" value={form.title} onChange={(e) => setField('title', e.target.value)} />
                    <textarea
                      placeholder="Descripción"
                      value={form.description}
                      onChange={(e) => setField('description', e.target.value)}
                      className="w-full border border-ink-100 rounded-xl px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-mishell-600 resize-none"
                      rows={3}
                    />
                  </div>
                </section>

                <section>
                  <h2 className="text-sm font-bold text-ink-900 mb-3">Ubicación</h2>
                  <div className="flex flex-col gap-3">
                    <Input icon={<MapPin size={16} />} placeholder="Dirección *" value={form.address} onChange={(e) => setField('address', e.target.value)} />
                    <div className="flex gap-2 flex-wrap">
                      {CITIES.map((c) => (
                        <button key={c} type="button" onClick={() => setField('city', c)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                            ${form.city === c ? 'bg-mishell-600 text-white border-mishell-600' : 'bg-white text-ink-700 border-ink-100'}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs font-medium text-ink-700 flex items-center gap-1">
                      <MapPin size={12} className="text-mishell-600" />
                      Ubicación exacta en el mapa
                    </p>
                    <div className="h-52 rounded-2xl overflow-hidden border border-ink-100">
                      <GoogleMapPicker
                        value={coords}
                        onChange={setCoords}
                        onAddressChange={(addr) => setField('address', addr)}
                      />
                    </div>
                    {coords && (
                      <p className="text-[11px] text-ink-500 text-center">
                        {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                      </p>
                    )}
                  </div>
                </section>

                <section>
                  <h2 className="text-sm font-bold text-ink-900 mb-3">Precio y capacidad</h2>
                  <div className="flex flex-col gap-3">
                    <Input placeholder="Precio por semana (S/) *" value={form.pricePerWeek} onChange={(e) => setField('pricePerWeek', e.target.value)} inputMode="numeric" />
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-ink-500 block mb-1">Habitaciones</label>
                        <Input value={form.rooms} onChange={(e) => setField('rooms', e.target.value)} inputMode="numeric" />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-ink-500 block mb-1">Cap. máx.</label>
                        <Input value={form.maxCapacity} onChange={(e) => setField('maxCapacity', e.target.value)} inputMode="numeric" />
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-sm font-bold text-ink-900 mb-3">Servicios</h2>
                  <div className="flex flex-wrap gap-2">
                    {AMENITY_OPTIONS.map(({ key, label }) => (
                      <button key={key} type="button" onClick={() => toggleAmenity(key)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                          ${form.amenities.includes(key) ? 'bg-mishell-600 text-white border-mishell-600' : 'bg-white text-ink-700 border-ink-100'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </section>

                {saveError && <p className="text-sm text-mishell-600 text-center">{saveError}</p>}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save FAB */}
      <AnimatePresence>
        {tab === 'editar' && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-ink-100 px-5 py-3 z-50"
          >
            <Button loading={saving} onClick={handleSave}>
              <Save size={16} className="mr-2" />
              Guardar cambios
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
