import type { User } from './user';

export type PropertyStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'PENDING_APPROVAL';

export interface PropertyPhoto {
  id: string;
  s3Key: string;
  order: number;
}

export interface PropertyFilters {
  search?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  createdAfter?: string;
}

export interface UpdatePropertyData {
  title?: string;
  description?: string;
  address?: string;
  city?: string;
  province?: string;
  district?: string;
  apartmentName?: string;
  roomNumber?: string;
  country?: string;
  pricePerWeek?: number;
  rooms?: number;
  maxCapacity?: number;
  amenities?: string[];
  restrictions?: string[];
  latitude?: number;
  longitude?: number;
}

export interface Property {
  id: string;
  title: string;
  description?: string;
  address: string;
  city: string;
  province?: string;
  district?: string;
  apartmentName?: string;
  roomNumber?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  pricePerWeek: number;
  rooms: number;
  maxCapacity: number;
  amenities: string[];
  restrictions: string[];
  status: PropertyStatus;
  owner: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
  photos: PropertyPhoto[];
  photoUrls: string[];
  contractTemplateId?: string;
  createdAt: string;
}
