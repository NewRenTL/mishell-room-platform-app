import { useEffect, useRef, useState } from 'react';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

const PLACES_LIBRARIES: ('places')[] = ['places'];

interface Props {
  value: string;
  onChange: (address: string, coords?: { lat: number; lng: number }) => void;
  city?: string;
  placeholder?: string;
}

const CITY_BOUNDS: Record<string, { lat: number; lng: number; radius: number }> = {
  Amazonas:       { lat:  -6.2312, lng: -77.8697, radius: 25000 },
  'Áncash':       { lat:  -9.5269, lng: -77.5278, radius: 25000 },
  'Apurímac':     { lat: -13.6387, lng: -72.8817, radius: 25000 },
  Arequipa:       { lat: -16.4090, lng: -71.5375, radius: 25000 },
  Ayacucho:       { lat: -13.1588, lng: -74.2236, radius: 25000 },
  Cajamarca:      { lat:  -7.1635, lng: -78.5003, radius: 25000 },
  Callao:         { lat: -12.0566, lng: -77.1181, radius: 12000 },
  Cusco:          { lat: -13.5320, lng: -71.9675, radius: 25000 },
  Huancavelica:   { lat: -12.7863, lng: -74.9750, radius: 25000 },
  'Huánuco':      { lat:  -9.9303, lng: -76.2422, radius: 25000 },
  Ica:            { lat: -14.0678, lng: -75.7286, radius: 25000 },
  'Junín':        { lat: -12.0651, lng: -75.2049, radius: 25000 },
  'La Libertad':  { lat:  -8.1116, lng: -79.0290, radius: 25000 },
  Lambayeque:     { lat:  -6.7714, lng: -79.8409, radius: 25000 },
  Lima:           { lat: -12.0464, lng: -77.0428, radius: 40000 },
  Loreto:         { lat:  -3.7491, lng: -73.2538, radius: 25000 },
  'Madre de Dios':{ lat: -12.5941, lng: -69.1890, radius: 25000 },
  Moquegua:       { lat: -17.1947, lng: -70.9346, radius: 25000 },
  Pasco:          { lat: -10.6851, lng: -76.2651, radius: 25000 },
  Piura:          { lat:  -5.1945, lng: -80.6328, radius: 25000 },
  Puno:           { lat: -15.8402, lng: -70.0219, radius: 25000 },
  'San Martín':   { lat:  -6.0340, lng: -76.9722, radius: 25000 },
  Tacna:          { lat: -18.0066, lng: -70.2464, radius: 25000 },
  Tumbes:         { lat:  -3.5669, lng: -80.4515, radius: 20000 },
  Ucayali:        { lat:  -8.3791, lng: -74.5539, radius: 25000 },
};

export function AddressAutocomplete({
  value,
  onChange,
  city = 'Lima',
  placeholder = 'Dirección *',
}: Props) {
  const { isLoaded } = useJsApiLoader({
    id: 'mishell-google-maps',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: PLACES_LIBRARIES,
  });

  const acRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Re-bias to the selected city whenever it changes
  useEffect(() => {
    if (!isLoaded || !acRef.current) return;
    const center = CITY_BOUNDS[city] ?? CITY_BOUNDS.Lima;
    const circle = new window.google.maps.Circle({
      center: { lat: center.lat, lng: center.lng },
      radius: center.radius,
    });
    const bounds = circle.getBounds();
    if (bounds) acRef.current.setBounds(bounds);
  }, [city, isLoaded]);

  function handlePlaceChanged() {
    const ac = acRef.current;
    if (!ac) return;
    const place = ac.getPlace();
    const formatted = (place.formatted_address ?? place.name ?? '')
      .replace(/,\s*Per[uú]$/i, '')
      .trim();
    if (place.geometry?.location) {
      const coords = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setInternalValue(formatted);
      onChange(formatted, coords);
    } else if (formatted) {
      setInternalValue(formatted);
      onChange(formatted);
    }
  }

  const inputEl = (
    <div className="relative">
      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={internalValue}
        onChange={(e) => {
          setInternalValue(e.target.value);
          onChange(e.target.value);
        }}
        className="w-full border border-ink-100 rounded-xl pl-9 pr-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-mishell-600"
      />
    </div>
  );

  if (!isLoaded) return inputEl;

  return (
    <Autocomplete
      onLoad={(ac) => { acRef.current = ac; }}
      onPlaceChanged={handlePlaceChanged}
      options={{
        componentRestrictions: { country: 'pe' },
        fields: ['formatted_address', 'geometry', 'name'],
        types: ['geocode'],
      }}
    >
      {inputEl}
    </Autocomplete>
  );
}
