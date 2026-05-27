import api from './api';
import type { BookingWithPayments, PaginatedResponse } from '../types';

export const weeklyPaymentsService = {
  getMyPayments: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<BookingWithPayments>>('/weekly-payments/my', { params }),

  markPaid: (paymentId: string, dto: { voucherMethod: string; voucherKey?: string }) =>
    api.patch(`/weekly-payments/${paymentId}/pay`, dto),

  uploadVoucher: (paymentId: string, file: File) => {
    const form = new FormData();
    form.append('voucher', file);
    return api.post<{ key: string }>(`/weekly-payments/${paymentId}/voucher`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  setDepartureNotice: (bookingId: string, departureDate: string) =>
    api.patch(`/weekly-payments/bookings/${bookingId}/departure`, { departureDate }),
};
