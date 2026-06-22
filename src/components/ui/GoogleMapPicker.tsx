import { useCallback, useEffect, useRef, useState } from 'react';
import { Autocomplete, GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { MapPin, LocateFixed, Search } from 'lucide-react';

const LIMA = { lat: -12.0464, lng: -77.0428 };
const PLACES_LIBRARIES: ('places')[] = ['places'];

const MISHELL_PIN = (() => {
  const svg = `
    <svg width="44" height="56" viewBox="0 0 44 56" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="s" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.25"/>
        </filter>
      </defs>
      <path d="M22 2C12.6 2 5 9.6 5 19c0 12.5 17 33 17 33S39 31.5 39 19C39 9.6 31.4 2 22 2z"
            fill="#E8272A" filter="url(#s)"/>
      <circle cx="22" cy="19" r="7" fill="white"/>
      <circle cx="22" cy="19" r="3.5" fill="#E8272A"/>
    </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
})();

const DRAGGING_PIN = (() => {
  const svg = `
    <svg width="44" height="56" viewBox="0 0 44 56" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="s" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M22 2C12.6 2 5 9.6 5 19c0 12.5 17 33 17 33S39 31.5 39 19C39 9.6 31.4 2 22 2z"
            fill="#c41f22" filter="url(#s)"/>
      <circle cx="22" cy="19" r="7" fill="white"/>
      <circle cx="22" cy="19" r="3.5" fill="#c41f22"/>
    </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
})();

interface Props {
  value?: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number }) => void;
  onAddressChange?: (address: string) => void;
}

export function GoogleMapPicker({ value, onChange, onAddressChange }: Props) {
  const { isLoaded } = useJsApiLoader({
    id: 'mishell-google-maps',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: PLACES_LIBRARIES,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const acRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(value ?? null);
  const [isDragging, setIsDragging] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync marker when parent updates coords (e.g. from AddressAutocomplete)
  useEffect(() => {
    if (!value) return;
    setMarker(value);
    if (mapRef.current) {
      mapRef.current.panTo(value);
      mapRef.current.setZoom(17);
    }
  }, [value?.lat, value?.lng]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    if (value) map.panTo(value);
  }, []);

  function reverseGeocode(coords: { lat: number; lng: number }) {
    if (!onAddressChange) return;
    setGeocoding(true);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: coords }, (results, status) => {
      setGeocoding(false);
      if (status === 'OK' && results?.[0]) {
        const address = results[0].formatted_address
          .replace(/,\s*Per[uú]$/i, '')
          .trim();
        onAddressChange(address);
      }
    });
  }

  function handleClick(e: google.maps.MapMouseEvent) {
    if (!e.latLng) return;
    const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarker(coords);
    onChange(coords);
    reverseGeocode(coords);
  }

  function handleDragEnd(e: google.maps.MapMouseEvent) {
    if (!e.latLng) return;
    const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarker(coords);
    onChange(coords);
    setIsDragging(false);
    reverseGeocode(coords);
  }

  function centerOnMarker() {
    if (marker && mapRef.current) {
      mapRef.current.panTo(marker);
      mapRef.current.setZoom(17);
    }
  }

  function handleSearchPlaceChanged() {
    const ac = acRef.current;
    if (!ac) return;
    const place = ac.getPlace();
    if (!place.geometry?.location) return;
    const coords = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    const formatted = (place.formatted_address ?? place.name ?? '')
      .replace(/,\s*Per[uú]$/i, '')
      .trim();
    setMarker(coords);
    onChange(coords);
    setSearchQuery(formatted);
    if (onAddressChange) onAddressChange(formatted);
    if (mapRef.current) {
      mapRef.current.panTo(coords);
      mapRef.current.setZoom(17);
    }
  }

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-ink-50 rounded-2xl">
        <div className="w-6 h-6 border-2 border-mishell-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const iconConfig = {
    url: isDragging ? DRAGGING_PIN : MISHELL_PIN,
    scaledSize: new window.google.maps.Size(44, 56),
    anchor: new window.google.maps.Point(22, 56),
  };

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerClassName="w-full h-full rounded-2xl overflow-hidden"
        center={marker ?? LIMA}
        zoom={marker ? 16 : 13}
        onClick={handleClick}
        onLoad={onLoad}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
          gestureHandling: 'greedy',
          styles: [
            { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          ],
        }}
      >
        {marker && (
          <MarkerF
            position={marker}
            draggable
            icon={iconConfig}
            animation={window.google.maps.Animation.DROP}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
          />
        )}
      </GoogleMap>

      {/* Search box inside map */}
      <div className="absolute top-2.5 left-2.5 right-14 z-10">
        <Autocomplete
          onLoad={(ac) => { acRef.current = ac; }}
          onPlaceChanged={handleSearchPlaceChanged}
          options={{
            componentRestrictions: { country: 'pe' },
            fields: ['formatted_address', 'geometry', 'name'],
          }}
        >
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en el mapa…"
              className="w-full bg-white/95 backdrop-blur-sm shadow-md border border-ink-100 rounded-full pl-8 pr-3 py-2 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-mishell-600"
            />
          </div>
        </Autocomplete>
      </div>

      {/* Hint when no search used */}
      {!searchQuery && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-full px-3.5 py-1.5 flex items-center gap-1.5 shadow-sm pointer-events-none">
          {geocoding
            ? <div className="w-3 h-3 border border-mishell-600 border-t-transparent rounded-full animate-spin shrink-0" />
            : <MapPin size={12} className="text-mishell-600 shrink-0" />
          }
          <span className="text-[11px] font-medium text-ink-700 whitespace-nowrap">
            {geocoding ? 'Obteniendo dirección…' : marker ? 'Arrastra el pin para ajustar' : 'Busca o toca el mapa para marcar'}
          </span>
        </div>
      )}

      {/* Re-center button */}
      {marker && (
        <button
          onClick={centerOnMarker}
          className="absolute bottom-3 right-3 w-9 h-9 bg-white rounded-full shadow-md border border-ink-100 flex items-center justify-center"
        >
          <LocateFixed size={16} className="text-mishell-600" />
        </button>
      )}

      {/* Coordinates badge */}
      {marker && (
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-1.5 shadow-sm border border-ink-100">
          <p className="text-[10px] font-mono text-ink-600 leading-tight">
            {marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}
          </p>
        </div>
      )}
    </div>
  );
}
