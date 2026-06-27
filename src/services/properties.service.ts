import api from './api';
import type { Property, PaginatedResponse, PropertyPhoto, PropertyFilters, UpdatePropertyData } from '../types';

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
