import api from './api';
import type { Booking, Contract, PaymentMethod, PaginatedResponse } from '../types';

export const bookingsService = {
  create: (data: { propertyId: string; checkIn: string; checkOut?: string; notes?: string; guestName?: string; guestDni?: string }) =>
    api.post<Booking>('/bookings', data),

  getMine: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Booking>>('/bookings/mine', { params }),

  getOne: (id: string) =>
    api.get<Booking>(`/bookings/${id}`),

  updatePayment: (id: string, paymentMethod: PaymentMethod) =>
    api.patch<Booking>(`/bookings/${id}/payment`, { paymentMethod }),

  confirm: (id: string) =>
    api.patch<Booking>(`/bookings/${id}/confirm`),

  cancel: (id: string) =>
    api.patch<Booking>(`/bookings/${id}/cancel`),

  getByProperty: (propertyId: string, params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Booking>>(`/bookings/property/${propertyId}`, { params }),

  getContract: (bookingId: string) =>
    api.get<Contract>(`/bookings/${bookingId}/contract`),

  signContract: (bookingId: string, signatureId: string) =>
    api.patch<Booking>(`/bookings/${bookingId}/sign-contract`, { signatureId }),

  getContractDownloadUrl: (bookingId: string) =>
    api.get<{ url: string }>(`/bookings/${bookingId}/contract/download`),

  getSocioStats: () =>
    api.get<{ totalProperties: number; totalBookings: number; activeBookings: number; totalRevenue: number }>('/bookings/socio/stats'),
};
