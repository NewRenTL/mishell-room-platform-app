import { useState } from 'react';
import { User, CreditCard, Phone } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { DateInput } from '../../../components/ui/DateInput';
import { Button } from '../../../components/ui/Button';
import { bookingsService } from '../../../services/bookings.service';
import { getApiErrorMessage } from '../../../utils/error';
import { useBookingStore } from '../../../stores/bookingStore';
import { useAuthStore } from '../../../stores/authStore';
import type { Property } from '../../../types';

interface Props {
  propertyId: string;
  property?: Property;
  onNext: () => void;
}

const WEEK_OPTIONS = [
  { label: '1 sem.', weeks: 1 },
  { label: 'Libre',  weeks: 0 },
];

function addWeeks(dateStr: string, weeks: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().split('T')[0];
}

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}

export default function Step1Guest({ propertyId, property, onNext }: Props) {
  const user = useAuthStore((s) => s.user);
  const setGuestData = useBookingStore((s) => s.setGuestData);
  const setDates = useBookingStore((s) => s.setDates);
  const setBookingIds = useBookingStore((s) => s.setBookingIds);

  const today = new Date().toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [selectedWeeks, setSelectedWeeks] = useState(1);
  const [name, setName]   = useState(user ? `${user.firstName} ${user.lastName ?? ''}`.trim() : '');
  const [dni, setDni]     = useState(user?.dni ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isLibre = selectedWeeks === 0;
  const checkOut = isLibre ? null : addWeeks(checkIn, selectedWeeks);
  const pricePerWeek = property ? Number(property.pricePerWeek) : 0;
  const total = isLibre ? pricePerWeek : pricePerWeek * selectedWeeks;

  async function handleNext() {
    if (!name.trim() || !dni.trim() || !checkIn) {
      setError('Completa todos los campos obligatorios');
      return;
    }
    setError('');
    setLoading(true);
    try {
      setGuestData({ name, dni, phone });
      setDates(checkIn, checkOut ?? undefined);

      const res = await bookingsService.create({
        propertyId,
        checkIn,
        checkOut: checkOut ?? undefined,
        notes: `Huésped: ${name}, DNI: ${dni}`,
        guestName: name,
        guestDni: dni,
      });
      const booking = res.data;
      setBookingIds(booking.id, booking.contract?.id ?? null);
      onNext();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Error al crear la reserva'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-5 py-6 flex flex-col gap-5">
      {property && (
        <div className="bg-ink-50 rounded-2xl p-4 flex gap-3 items-center">
          {property.photoUrls?.[0] && (
            <img src={property.photoUrls[0]} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
          )}
          <div>
            <p className="text-sm font-bold text-ink-900 leading-tight">{property.title}</p>
            <p className="text-xs text-ink-600 mt-0.5">{property.city}</p>
            <p className="text-sm font-semibold text-mishell-600 mt-1">S/ {pricePerWeek.toFixed(0)} / sem.</p>
          </div>
        </div>
      )}

      <section>
        <h2 className="text-sm font-bold text-ink-900 mb-3">Fechas</h2>
        <div className="flex flex-col gap-3">
          <DateInput
            label="Fecha de entrada (Check in)"
            value={checkIn}
            min={today}
            onChange={setCheckIn}
          />

          {/* Week selector */}
          <div>
            <p className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider mb-2">Duración</p>
            <div className="flex gap-2 flex-wrap">
              {WEEK_OPTIONS.map(({ label, weeks }) => {
                const active = selectedWeeks === weeks;
                return (
                  <button
                    key={weeks}
                    type="button"
                    onClick={() => setSelectedWeeks(weeks)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                      active
                        ? 'bg-ink-900 text-white border-ink-900'
                        : 'bg-white text-ink-700 border-ink-200 hover:border-ink-400'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Checkout date or libre note */}
          {isLibre ? (
            <p className="text-xs text-ink-500 bg-ink-50 rounded-xl px-3 py-2">
              Estadía libre — la fecha de salida se acordará con el administrador. Puedes notificarla desde "Mis Pagos".
            </p>
          ) : (
            <p className="text-xs text-ink-600">
              Fecha de Salida Estimada (Check out): <strong>{fmtDate(checkOut!)}</strong>
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-ink-900 mb-3">Datos del huésped</h2>
        <div className="flex flex-col gap-3">
          <Input
            icon={<User size={16} />}
            placeholder="Nombre completo *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            icon={<CreditCard size={16} />}
            placeholder="DNI *"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            required
            inputMode="numeric"
          />
          <Input
            icon={<Phone size={16} />}
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
          />
        </div>
      </section>

      {property && (
        <div className="bg-mishell-50 border border-mishell-100 rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-ink-600">
              {isLibre ? 'Precio por semana' : `${selectedWeeks} ${selectedWeeks === 1 ? 'semana' : 'semanas'}`}
            </span>
            <span className="text-lg font-bold text-ink-900">
              S/ {total.toFixed(0)}{isLibre ? ' / sem.' : ''}
            </span>
          </div>
          <p className="text-xs text-ink-400 mt-0.5">
            {isLibre ? 'El total se calculará según la duración real' : 'Total estimado del alojamiento'}
          </p>
        </div>
      )}

      {error && <p className="text-sm text-mishell-600 text-center">{error}</p>}

      <Button loading={loading} onClick={handleNext}>
        Continuar
      </Button>
    </div>
  );
}
