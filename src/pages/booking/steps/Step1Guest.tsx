import { useState } from 'react';
import { User, CreditCard, Phone } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { DateInput } from '../../../components/ui/DateInput';
import { Button } from '../../../components/ui/Button';
import { bookingsService } from '../../../services/bookings.service';
import { useBookingStore } from '../../../stores/bookingStore';
import { useAuthStore } from '../../../stores/authStore';
import type { Property } from '../../../types';

interface Props {
  propertyId: string;
  property?: Property;
  onNext: () => void;
}

function addWeeks(date: Date, weeks: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().split('T')[0];
}

export default function Step1Guest({ propertyId, property, onNext }: Props) {
  const user = useAuthStore((s) => s.user);
  const setGuestData = useBookingStore((s) => s.setGuestData);
  const setDates = useBookingStore((s) => s.setDates);
  const setBookingIds = useBookingStore((s) => s.setBookingIds);

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    name: user ? `${user.firstName} ${user.lastName ?? ''}`.trim() : '',
    dni: user?.dni ?? '',
    phone: user?.phone ?? '',
    checkIn: today,
    weeks: '1',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set(key: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  const checkOut = addWeeks(new Date(form.checkIn), Number(form.weeks) || 1);
  const total = property ? Number(property.pricePerWeek) * (Number(form.weeks) || 1) : 0;

  async function handleNext() {
    if (!form.name.trim() || !form.dni.trim() || !form.checkIn) {
      setError('Completa todos los campos obligatorios');
      return;
    }
    setError('');
    setLoading(true);
    try {
      setGuestData({ name: form.name, dni: form.dni, phone: form.phone });
      setDates(form.checkIn, checkOut);

      const res = await bookingsService.create({
        propertyId,
        checkIn: form.checkIn,
        checkOut,
        notes: `Huésped: ${form.name}, DNI: ${form.dni}`,
      });
      const booking = res.data;
      setBookingIds(booking.id, booking.contract?.id ?? null);
      onNext();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-5 py-6 flex flex-col gap-5">
      {property && (
        <div className="bg-ink-50 rounded-2xl p-4 flex gap-3 items-center">
          {property.photoUrls?.[0] && (
            <img src={property.photoUrls[0]} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
          )}
          <div>
            <p className="text-sm font-bold text-ink-900 leading-tight">{property.title}</p>
            <p className="text-xs text-ink-600 mt-0.5">{property.city}</p>
            <p className="text-sm font-semibold text-mishell-600 mt-1">S/ {Number(property.pricePerWeek).toFixed(0)} / sem.</p>
          </div>
        </div>
      )}

      <section>
        <h2 className="text-sm font-bold text-ink-900 mb-3">Fechas</h2>
        <div className="flex flex-col gap-3">
          <DateInput
            label="Fecha de entrada"
            value={form.checkIn}
            min={today}
            onChange={(val) => set('checkIn', val)}
          />
          <div className="flex gap-3">
            {[1, 2, 4, 7].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => set('weeks', String(w))}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors
                  ${form.weeks === String(w)
                    ? 'bg-mishell-600 text-white border-mishell-600'
                    : 'bg-white text-ink-700 border-ink-100'}`}
              >
                {w} {w === 1 ? 'semana' : 'semanas'}
              </button>
            ))}
          </div>
          <p className="text-xs text-ink-600">Salida estimada: <strong>{checkOut}</strong></p>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-ink-900 mb-3">Datos del huésped</h2>
        <div className="flex flex-col gap-3">
          <Input
            icon={<User size={16} />}
            placeholder="Nombre completo *"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
          />
          <Input
            icon={<CreditCard size={16} />}
            placeholder="DNI *"
            value={form.dni}
            onChange={(e) => set('dni', e.target.value)}
            required
            inputMode="numeric"
          />
          <Input
            icon={<Phone size={16} />}
            placeholder="Teléfono"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            inputMode="tel"
          />
        </div>
      </section>

      {total > 0 && (
        <div className="bg-mishell-50 border border-mishell-100 rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-ink-600">{form.weeks || 1} {Number(form.weeks) === 1 ? 'semana' : 'semanas'}</span>
            <span className="text-lg font-bold text-ink-900">S/ {total.toFixed(0)}</span>
          </div>
          <p className="text-xs text-ink-400 mt-0.5">Total estimado del alojamiento</p>
        </div>
      )}

      {error && <p className="text-sm text-mishell-600 text-center">{error}</p>}

      <Button loading={loading} onClick={handleNext}>
        Continuar
      </Button>
    </div>
  );
}
