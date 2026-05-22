import api from './api';
import type { BookingWithPayments } from '../types';

export const weeklyPaymentsService = {
  getMyPayments: () =>
    api.get<{ data: BookingWithPayments[] }>('/weekly-payments/my'),

  markPaid: (paymentId: string) =>
    api.patch(`/weekly-payments/${paymentId}/pay`),

  setDepartureNotice: (bookingId: string, departureDate: string) =>
    api.patch(`/weekly-payments/bookings/${bookingId}/departure`, { departureDate }),
};
