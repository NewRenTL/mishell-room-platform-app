import api from './api';
import type { CardPaymentPayload } from '../types';

interface MpCheckoutResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
}

interface CardPaymentResponse {
  status: string;
  statusDetail: string;
  paymentId: number;
}

interface YapePaymentResponse {
  status: string;
  statusDetail: string;
  paymentId: number;
}

export const paymentsService = {
  createMpCheckout: (bookingId: string) =>
    api.post<MpCheckoutResponse>('/payments/mp-checkout', { bookingId }),

  processCard: (bookingId: string, payload: CardPaymentPayload) =>
    api.post<CardPaymentResponse>('/payments/card', { bookingId, ...payload }),

  processYape: (bookingId: string, otp: string, phoneNumber: string) =>
    api.post<YapePaymentResponse>('/payments/yape', { bookingId, otp, phoneNumber }),
};
