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
  Lima:     { lat: -12.0464, lng: -77.0428, radius: 30000 },
  Arequipa: { lat: -16.4090, lng: -71.5375, radius: 15000 },
  Cusco:    { lat: -13.5320, lng: -71.9675, radius: 15000 },
  Trujillo: { lat:  -8.1116, lng: -79.0290, radius: 15000 },
  Piura:    { lat:  -5.1945, lng: -80.6328, radius: 15000 },
  Chiclayo: { lat:  -6.7714, lng: -79.8409, radius: 15000 },
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
