import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  resumeStep: number;

  setProperty: (id: string) => void;
  setDates: (checkIn: string, checkOut: string | null) => void;
  setGuestData: (data: GuestData) => void;
  setSignature: (dataUrl: string, signatureId: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setBookingIds: (bookingId: string, contractId: string | null) => void;
  setResumeStep: (step: number) => void;
  reset: () => void;
}

type Actions =
  | 'setProperty' | 'setDates' | 'setGuestData'
  | 'setSignature' | 'setPaymentMethod' | 'setBookingIds'
  | 'setResumeStep' | 'reset';

const INITIAL: Omit<BookingState, Actions> = {
  propertyId: null,
  checkIn: null,
  checkOut: null,
  guestData: { name: '', dni: '', phone: '' },
  signatureDataUrl: null,
  signatureId: null,
  paymentMethod: null,
  bookingId: null,
  contractId: null,
  resumeStep: 1,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      ...INITIAL,
      setProperty: (propertyId) => set({ propertyId }),
      setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
      setGuestData: (guestData) => set({ guestData }),
      setSignature: (signatureDataUrl, signatureId) => set({ signatureDataUrl, signatureId }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      setBookingIds: (bookingId, contractId) => set({ bookingId, contractId }),
      setResumeStep: (resumeStep) => set({ resumeStep }),
      reset: () => set(INITIAL),
    }),
    {
      name: 'mishell-booking',
      partialize: (state) => ({
        propertyId: state.propertyId,
        bookingId: state.bookingId,
        contractId: state.contractId,
        paymentMethod: state.paymentMethod,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        guestData: state.guestData,
        signatureId: state.signatureId,
        resumeStep: state.resumeStep,
      }),
    },
  ),
);
