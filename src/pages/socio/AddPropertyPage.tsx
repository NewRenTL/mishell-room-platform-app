import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MapPin, DollarSign, Users, FileText } from 'lucide-react';
import { AppHeader } from '../../components/layout/AppHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { GoogleMapPicker } from '../../components/ui/GoogleMapPicker';
import api from '../../services/api';
import { AMENITY_OPTIONS } from '../../utils/amenities';

const CITIES = ['Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Piura', 'Chiclayo'];

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    city: 'Lima',
    rooms: '1',
    maxCapacity: '2',
    pricePerWeek: '',
  });
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  function set(key: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function toggleAmenity(key: string) {
    setSelectedAmenities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  async function handleSubmit() {
    if (!form.title.trim() || !form.address.trim() || !form.pricePerWeek) {
      setError('Título, dirección y precio son obligatorios');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/properties', {
        title: form.title,
        description: form.description || undefined,
        address: form.address,
        city: form.city,
        rooms: Number(form.rooms),
        maxCapacity: Number(form.maxCapacity),
        pricePerWeek: Number(form.pricePerWeek),
        amenities: selectedAmenities,
        restrictions: [],
        latitude:  coords?.lat,
        longitude: coords?.lng,
      });
      navigate('/socio', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al publicar la propiedad');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[430px] mx-auto flex flex-col min-h-dvh bg-white">
      <AppHeader title="Nueva propiedad" />

      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5 pb-28">
        {/* Basic info */}
        <section>
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
        <section>
          <h2 className="text-sm font-bold text-ink-900 mb-3">Ubicación</h2>
          <div className="flex flex-col gap-3">
            <Input
              icon={<MapPin size={16} />}
              placeholder="Dirección *"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
            />
            <div className="flex gap-2 flex-wrap">
              {CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('city', c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                    ${form.city === c ? 'bg-mishell-600 text-white border-mishell-600' : 'bg-white text-ink-700 border-ink-100'}`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Map picker */}
            <div>
              <p className="text-xs font-medium text-ink-700 mb-2 flex items-center gap-1">
                <MapPin size={12} className="text-mishell-600" />
                Marca la ubicación exacta en el mapa
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
              icon={<DollarSign size={16} />}
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
                  value={form.rooms}
                  onChange={(e) => set('rooms', e.target.value)}
                  inputMode="numeric"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-ink-500 block mb-1">Cap. máx. personas</label>
                <Input
                  icon={<Users size={16} />}
                  value={form.maxCapacity}
                  onChange={(e) => set('maxCapacity', e.target.value)}
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>
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
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-ink-100 px-5 py-3 z-50">
        <Button loading={loading} onClick={handleSubmit}>
          <FileText size={16} className="mr-2" />
          Publicar propiedad
        </Button>
      </div>
    </div>
  );
}
