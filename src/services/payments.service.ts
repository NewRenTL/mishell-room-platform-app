import api from './api';

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

export interface CardPaymentPayload {
  token: string;
  paymentMethodId: string;
  issuerId?: string;
  installments: number;
  cardholderEmail: string;
  identificationType?: string;
  identificationNumber?: string;
}

export const paymentsService = {
  createMpCheckout: (bookingId: string) =>
    api.post<{ data: MpCheckoutResponse }>('/payments/mp-checkout', { bookingId }),

  processCard: (bookingId: string, payload: CardPaymentPayload) =>
    api.post<{ data: CardPaymentResponse }>('/payments/card', { bookingId, ...payload }),

  processYape: (bookingId: string, yapeToken: string) =>
    api.post<{ data: YapePaymentResponse }>('/payments/yape', { bookingId, yapeToken }),
};
