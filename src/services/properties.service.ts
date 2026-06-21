import api from './api';
import type { Property, PaginatedResponse, PropertyPhoto } from '../types';

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
  provincia?: string;
  distrito?: string;
  numeroDpto?: string;
  pricePerWeek?: number;
  rooms?: number;
  maxCapacity?: number;
  amenities?: string[];
  latitude?: number;
  longitude?: number;
}

export const propertiesService = {
  getAll: (filters?: PropertyFilters) =>
    api.get<PaginatedResponse<Property>>('/properties', { params: filters }),

  getOne: (id: string) =>
    api.get<Property>(`/properties/${id}`),

  getMine: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Property>>('/properties/owner/mine', { params }),

  update: (id: string, data: UpdatePropertyData) =>
    api.patch<Property>(`/properties/${id}`, data),

  addPhoto: (id: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<PropertyPhoto>(`/properties/${id}/photos`, form);
  },

  deletePhoto: (propertyId: string, photoId: string) =>
    api.delete(`/properties/${propertyId}/photos/${photoId}`),

  changeStatus: (id: string, status: string) =>
    api.patch(`/properties/${id}/status`, { status }),
};
