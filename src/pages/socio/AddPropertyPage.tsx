import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MapPin, Users, FileText, X, ImagePlus, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { AppHeader } from '../../components/layout/AppHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { GoogleMapPicker } from '../../components/ui/GoogleMapPicker';
import { AddressAutocomplete } from '../../components/ui/AddressAutocomplete';
import api from '../../services/api';
import { propertiesService } from '../../services/properties.service';
import { getApiErrorMessage } from '../../utils/error';
import { AMENITY_OPTIONS } from '../../utils/amenities';
import { PageTutorial } from '../../components/ui/PageTutorial';
import { PERU_DEPARTMENTS, getProvinces, getDistricts } from '../../utils/peruLocations';

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    province: '',
    district: '',
    apartmentName: '',
    roomNumber: '',
    rooms: '1',
    maxCapacity: '2',
    pricePerWeek: '',
  });
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState('');
  const [createdId, setCreatedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function set(key: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function toggleAmenity(key: string) {
    setSelectedAmenities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function handlePhotoFiles(files: FileList | null) {
    if (!files) return;
    setPhotoError('');
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    const incoming = Array.from(files).filter((f) => {
      if (!allowed.includes(f.type)) { setPhotoError('Solo se aceptan JPG, PNG o WEBP'); return false; }
      if (f.size > 5 * 1024 * 1024) { setPhotoError('Cada foto no puede superar 5 MB'); return false; }
      return true;
    });
    setPhotos((prev) => [...prev, ...incoming].slice(0, 7));
  }

  function removePhoto(idx: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit() {
    if (!form.title.trim() || !form.city || !form.address.trim() || !form.pricePerWeek) {
      setError('Título, departamento, dirección y precio son obligatorios');
      return;
    }
    if (Number(form.pricePerWeek) <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }
    if (Number(form.rooms) < 1) {
      setError('El número de habitaciones debe ser al menos 1');
      return;
    }
    if (Number(form.maxCapacity) < 1) {
      setError('La capacidad máxima debe ser al menos 1');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data: created } = await api.post<{ id: string }>('/properties', {
        title: form.title,
        description: form.description || undefined,
        address: form.address,
        city: form.city,
        province: form.province || undefined,
        district: form.district || undefined,
        apartmentName: form.apartmentName || undefined,
        roomNumber: form.roomNumber || undefined,
        country: 'Peru',
        rooms: Number(form.rooms),
        maxCapacity: Number(form.maxCapacity),
        pricePerWeek: Number(form.pricePerWeek),
        amenities: selectedAmenities,
        restrictions: [],
        latitude:  coords?.lat,
        longitude: coords?.lng,
      });
      for (const photo of photos) {
        await propertiesService.addPhoto(created.id, photo);
      }
      setCreatedId(created.id);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Error al publicar la propiedad'));
    } finally {
      setLoading(false);
    }
  }

  if (createdId) {
    return (
      <div className="max-w-107.5 mx-auto flex flex-col min-h-dvh bg-white items-center justify-center px-8 text-center gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"
        >
          <CheckCircle2 size={40} className="text-green-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-2"
        >
          <h2 className="text-xl font-bold text-ink-900">¡Propiedad publicada!</h2>
          <p className="text-sm text-ink-600 leading-relaxed">
            Tu propiedad está en revisión.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col gap-3 w-full"
        >
          <Button onClick={() => navigate(`/socio/properties/${createdId}`)}>
            Gestionar propiedad
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-107.5 mx-auto flex flex-col min-h-dvh bg-white">
      <AppHeader title="Nueva propiedad" />

      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5 pb-28">
        {/* Basic info */}
        <section data-tutorial="basic-info">
          <h2 className="text-sm font-bold text-ink-900 mb-3">Información básica</h2>
          <div className="flex flex-col gap-3">
            <Input
              icon={<Home size={16} />}
              placeholder="Título de la propiedad *"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
            <textarea
              placeholder="Descripción (opcional)"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              className="w-full border border-ink-100 rounded-xl px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-mishell-600 resize-none"
              rows={3}
            />
          </div>
        </section>

        {/* Location */}
        <section data-tutorial="location">
          <h2 className="text-sm font-bold text-ink-900 mb-3">Ubicación</h2>
          <div className="flex flex-col gap-3">
            <Select
              placeholder="Departamento *"
              value={form.city}
              onChange={(val) => setForm((f) => ({ ...f, city: val, province: '', district: '' }))}
              options={PERU_DEPARTMENTS.map((d) => ({ value: d, label: d }))}
            />
            <AddressAutocomplete
              value={form.address}
              city={form.city}
              placeholder="Dirección — escribe y elige una sugerencia *"
              onChange={(addr, coordsResult) => {
                set('address', addr);
                if (coordsResult) setCoords(coordsResult);
              }}
            />
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  placeholder="Provincia"
                  value={form.province}
                  onChange={(val) => setForm((f) => ({ ...f, province: val, district: '' }))}
                  disabled={!form.city}
                  options={getProvinces(form.city).map((p) => ({ value: p.name, label: p.name }))}
                />
              </div>
              <div className="flex-1">
                <Select
                  placeholder="Distrito"
                  value={form.district}
                  onChange={(val) => set('district', val)}
                  disabled={!form.province}
                  options={getDistricts(form.city, form.province).map((d) => ({ value: d, label: d }))}
                />
              </div>
            </div>
            <Input
              placeholder="Nombre del departamento (ej: Departamento A 301)"
              value={form.apartmentName}
              onChange={(e) => set('apartmentName', e.target.value)}
            />
            <Input
              placeholder="Número de habitación (ej: Habitación 2)"
              value={form.roomNumber}
              onChange={(e) => set('roomNumber', e.target.value)}
            />

            {/* Map picker */}
            <div>
              <p className="text-xs font-medium text-ink-700 mb-2 flex items-center gap-1">
                <MapPin size={12} className="text-mishell-600" />
                Marcar Ubicación aproximada en el mapa
              </p>
              <div className="h-56 rounded-2xl overflow-hidden border border-ink-100">
                <GoogleMapPicker
                  value={coords}
                  onChange={setCoords}
                  onAddressChange={(addr) => set('address', addr)}
                />
              </div>
              {coords && (
                <p className="text-[11px] text-ink-500 mt-1.5 text-center">
                  Ubicación guardada · {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Pricing & capacity */}
        <section>
          <h2 className="text-sm font-bold text-ink-900 mb-3">Precio y capacidad</h2>
          <div className="flex flex-col gap-3">
            <Input
              icon={<span className="text-xs font-bold text-ink-500">S/</span>}
              placeholder="Precio por semana (S/) *"
              value={form.pricePerWeek}
              onChange={(e) => set('pricePerWeek', e.target.value)}
              inputMode="numeric"
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-ink-500 block mb-1">Habitaciones</label>
                <Input
                  icon={<Home size={16} />}
                  value="1"
                  readOnly
                  disabled
                />
                <p className="text-[10px] text-ink-400 mt-1">1 habitación por propiedad</p>
              </div>
              <div className="flex-1">
                <label className="text-xs text-ink-500 block mb-1">Personas</label>
                <Input
                  icon={<Users size={16} />}
                  value="1"
                  readOnly
                  disabled
                />
                <p className="text-[10px] text-ink-400 mt-1">1 persona por propiedad</p>
              </div>
            </div>
          </div>
        </section>

        {/* Photos */}
        <section data-tutorial="photos">
          <h2 className="text-sm font-bold text-ink-900 mb-1">Fotos de la propiedad</h2>
          <p className="text-xs text-ink-500 mb-3">Sube hasta 7 fotos. La primera será la portada.</p>

          <div className="flex gap-3 flex-wrap">
            {photos.map((file, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-ink-100 shrink-0">
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {idx === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] font-semibold text-center py-0.5">
                    Portada
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
                >
                  <X size={11} className="text-white" />
                </button>
              </div>
            ))}

            {photos.length < 7 && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-24 h-24 rounded-2xl border-2 border-dashed border-ink-200 bg-ink-50 flex flex-col items-center justify-center gap-1.5 text-ink-400 active:bg-ink-100 transition-colors shrink-0"
              >
                <ImagePlus size={22} />
                <span className="text-[10px] font-medium">Agregar foto</span>
              </button>
            )}
          </div>

          {photoError && <p className="mt-2 text-xs text-mishell-600">{photoError}</p>}

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            capture="environment"
            className="hidden"
            onChange={(e) => handlePhotoFiles(e.target.files)}
          />
        </section>

        {/* Amenities */}
        <section>
          <h2 className="text-sm font-bold text-ink-900 mb-3">Servicios incluidos</h2>
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleAmenity(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                  ${selectedAmenities.includes(key)
                    ? 'bg-mishell-600 text-white border-mishell-600'
                    : 'bg-white text-ink-700 border-ink-100'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {error && <p className="text-sm text-mishell-600 text-center">{error}</p>}
      </div>

      {/* FAB */}
      <div className="fixed bottom-0 left-0 right-0 max-w-107.5 mx-auto bg-white border-t border-ink-100 px-5 py-3 z-50">
        <Button loading={loading} onClick={handleSubmit}>
          <FileText size={16} className="mr-2" />
          Publicar propiedad
        </Button>
      </div>

      <PageTutorial
        id="add-property"
        buttonBottom="bottom-20"
        steps={[
          { title: 'Información básica', content: 'Escribe un título descriptivo y una descripción atractiva. Un buen título ayuda a los inquilinos a encontrar tu propiedad.', target: '[data-tutorial="basic-info"]' },
          { title: 'Ubicación exacta', content: 'Elige tu región, escribe la dirección (te saldrán sugerencias) y ajusta el pin en el mapa.', target: '[data-tutorial="location"]' },
          { title: 'Fotos de la propiedad', content: 'Sube hasta 7 fotos. La primera será la portada que ven los inquilinos. ¡Las fotos de calidad atraen más reservas!', target: '[data-tutorial="photos"]' },
          { title: 'Después de publicar', content: 'Importante: recuerda cambiar el estado de tu propiedad a "Disponible" para que los inquilinos puedan encontrarla y reservarla.' },
        ]}
      />
    </div>
  );
}
