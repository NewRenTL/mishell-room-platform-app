import { Wifi, Tv, Wind, Coffee, ShowerHead, Utensils, Car, Dumbbell, Snowflake, Flame, BookOpen, Volume2 } from 'lucide-react';

export const AMENITY_OPTIONS: { key: string; label: string }[] = [
  { key: 'wifi',        label: 'Wifi rápido' },
  { key: 'tv_hd',      label: 'Televisión HD' },
  { key: 'ac',         label: 'Aire acondicionado' },
  { key: 'cafetera',   label: 'Cafetera' },
  { key: 'ducha',      label: 'Ducha caliente' },
  { key: 'cocina',     label: 'Cocina equipada' },
  { key: 'parking',    label: 'Estacionamiento' },
  { key: 'gimnasio',   label: 'Gimnasio' },
  { key: 'frigobar',   label: 'Frigobar' },
  { key: 'calefaccion', label: 'Calefacción' },
  { key: 'escritorio', label: 'Escritorio' },
  { key: 'tv_cable',   label: 'TV Cable' },
];

export const AMENITY_LABELS: Record<string, string> = Object.fromEntries(
  AMENITY_OPTIONS.map(({ key, label }) => [key, label]),
);

export const AMENITY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  wifi:         Wifi,
  tv_hd:        Tv,
  ac:           Wind,
  cafetera:     Coffee,
  ducha:        ShowerHead,
  cocina:       Utensils,
  parking:      Car,
  gimnasio:     Dumbbell,
  frigobar:     Snowflake,
  calefaccion:  Flame,
  escritorio:   BookOpen,
  tv_cable:     Volume2,
};
