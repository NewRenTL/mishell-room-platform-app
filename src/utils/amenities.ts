import { Wifi, ShowerHead, Car, Microwave, Wind, ChefHat, UtensilsCrossed, Bath, Phone } from 'lucide-react';

export const AMENITY_OPTIONS: { key: string; label: string }[] = [
  { key: 'wifi',             label: 'Wifi rápido' },
  { key: 'ducha',            label: 'Ducha caliente' },
  { key: 'parking',          label: 'Estacionamiento' },
  { key: 'microondas',       label: 'Microondas' },
  { key: 'ventilador',       label: 'Ventilador' },
  { key: 'cocina',           label: 'Cocina' },
  { key: 'comedor',          label: 'Comedor personal' },
  { key: 'banio_compartido', label: 'Baño compartido' },
  { key: 'banio_personal',   label: 'Baño personal' },
  { key: 'intercomunicador', label: 'Intercomunicador' },
];

export const AMENITY_LABELS: Record<string, string> = Object.fromEntries(
  AMENITY_OPTIONS.map(({ key, label }) => [key, label]),
);

export const AMENITY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  wifi:             Wifi,
  ducha:            ShowerHead,
  parking:          Car,
  microondas:       Microwave,
  ventilador:       Wind,
  cocina:           ChefHat,
  comedor:          UtensilsCrossed,
  banio_compartido: Bath,
  banio_personal:   Bath,
  intercomunicador: Phone,
};

export const RESTRICTION_OPTIONS: { key: string; label: string }[] = [
  { key: 'sin_mascotas',      label: 'Sin mascotas' },
  { key: 'sin_ninos',         label: 'Sin niños' },
  { key: 'max_1_persona',     label: 'Capacidad máxima: 1 persona por habitación' },
  { key: 'sin_fumadores',     label: 'Prohibido para fumadores' },
  { key: 'sin_estacionamiento', label: 'No se puede estacionar en el alojamiento' },
];

export const RESTRICTION_LABELS: Record<string, string> = Object.fromEntries(
  RESTRICTION_OPTIONS.map(({ key, label }) => [key, label]),
);
