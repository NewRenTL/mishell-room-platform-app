import api from './api';

interface MpCheckoutResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
}

interface YapePaymentResponse {
  status: string;
  statusDetail: string;
  paymentId: number;
}

export const paymentsService = {
  createMpCheckout: (bookingId: string) =>
    api.post<{ data: MpCheckoutResponse }>('/payments/mp-checkout', { bookingId }),

  processYape: (bookingId: string, yapeToken: string) =>
    api.post<{ data: YapePaymentResponse }>('/payments/yape', { bookingId, yapeToken }),
};
