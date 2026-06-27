export interface CardPaymentPayload {
  token: string;
  paymentMethodId: string;
  issuerId?: string;
  installments: number;
  cardholderEmail: string;
  identificationType?: string;
  identificationNumber?: string;
}
