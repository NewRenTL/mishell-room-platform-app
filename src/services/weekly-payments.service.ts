import api from './api';
import type { BookingWithPayments, PaginatedResponse } from '../types';

export const weeklyPaymentsService = {
  getMyPayments: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<BookingWithPayments>>('/weekly-payments/my', { params }),

  markPaid: (paymentId: string) =>
    api.patch(`/weekly-payments/${paymentId}/pay`),

  setDepartureNotice: (bookingId: string, departureDate: string) =>
    api.patch(`/weekly-payments/bookings/${bookingId}/departure`, { departureDate }),
};
