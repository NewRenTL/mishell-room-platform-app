import type { User } from './user';
import type { Property } from './property';
import type { Contract } from './contract';

export type BookingStatus =
  | 'PENDING'
  | 'CONTRACT_PENDING'
  | 'CONTRACT_SIGNED'
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'ACTIVE'
  | 'OVERDUE'
  | 'COMPLETED'
  | 'CANCELLED';

export type WeeklyPaymentStatus = 'PENDING' | 'PAID' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type PaymentMethod = 'CARD' | 'MERCADO_PAGO' | 'YAPE' | 'TRANSFERENCIA' | 'EFECTIVO';

export interface WeeklyPayment {
  id: string;
  bookingId: string;
  weekNumber: number;
  dueDate: string;
  amount: number | string;
  status: WeeklyPaymentStatus;
  paidAt: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  voucherMethod: string | null;
  voucherKey: string | null;
  cancelledAt: string | null;
  createdAt: string;
}

export interface BookingWithPayments {
  id: string;
  referenceId: string;
  checkIn: string;
  checkOut: string | null;
  departureNoticeDate: string | null;
  paymentFrequencyDays: number;
  status: BookingStatus;
  totalAmount: number | string;
  property: { title: string; address: string };
  weeklyPayments: WeeklyPayment[];
}

export interface Booking {
  id: string;
  referenceId: string;
  propertyId: string;
  property: Property & { owner: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'> };
  tenantId: string;
  tenant: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'dni' | 'phone'>;
  checkIn: string;
  checkOut?: string;
  status: BookingStatus;
  totalAmount: number;
  paymentMethod?: PaymentMethod;
  contract?: Pick<Contract, 'id' | 'status' | 'signedDocumentKey'> | null;
  createdAt: string;
}
