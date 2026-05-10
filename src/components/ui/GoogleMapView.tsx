import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';

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

interface Props {
  lat: number;
  lng: number;
  title?: string;
}

export function GoogleMapView({ lat, lng, title }: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-ink-50">
        <div className="w-6 h-6 border-2 border-mishell-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full"
      center={{ lat, lng }}
      zoom={16}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        clickableIcons: false,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        ],
      }}
    >
      <MarkerF
        position={{ lat, lng }}
        title={title}
        icon={{
          url: MISHELL_PIN,
          scaledSize: new window.google.maps.Size(44, 56),
          anchor: new window.google.maps.Point(22, 56),
        }}
        animation={window.google.maps.Animation.DROP}
      />
    </GoogleMap>
  );
}
