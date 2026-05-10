import { create } from 'zustand';
import type { PaymentMethod } from '../types';

interface GuestData {
  name: string;
  dni: string;
  phone: string;
}

interface BookingState {
  propertyId: string | null;
  checkIn: string | null;
  checkOut: string | null;
  guestData: GuestData;
  signatureDataUrl: string | null;
  signatureId: string | null;
  paymentMethod: PaymentMethod | null;
  bookingId: string | null;
  contractId: string | null;

  setProperty: (id: string) => void;
  setDates: (checkIn: string, checkOut: string | null) => void;
  setGuestData: (data: GuestData) => void;
  setSignature: (dataUrl: string, signatureId: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setBookingIds: (bookingId: string, contractId: string | null) => void;
  reset: () => void;
}

const INITIAL: Omit<BookingState, keyof Pick<BookingState,
  'setProperty' | 'setDates' | 'setGuestData' |
  'setSignature' | 'setPaymentMethod' | 'setBookingIds' | 'reset'
>> = {
  propertyId: null,
  checkIn: null,
  checkOut: null,
  guestData: { name: '', dni: '', phone: '' },
  signatureDataUrl: null,
  signatureId: null,
  paymentMethod: null,
  bookingId: null,
  contractId: null,
};

export const useBookingStore = create<BookingState>((set) => ({
  ...INITIAL,
  setProperty: (propertyId) => set({ propertyId }),
  setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
  setGuestData: (guestData) => set({ guestData }),
  setSignature: (signatureDataUrl, signatureId) => set({ signatureDataUrl, signatureId }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setBookingIds: (bookingId, contractId) => set({ bookingId, contractId }),
  reset: () => set(INITIAL),
}));
