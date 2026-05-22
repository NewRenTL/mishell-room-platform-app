export type Role = 'ADMIN' | 'SOCIO' | 'INQUILINO' | 'SIGNER';

export type PropertyStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'PENDING_APPROVAL';
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
export type PaymentMethod = 'CARD' | 'MERCADO_PAGO' | 'YAPE';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dni?: string;
  avatarKey?: string;
  role: Role;
  status: 'ACTIVE' | 'INACTIVE';
  mustChangePassword: boolean;
}

export interface PropertyPhoto {
  id: string;
  s3Key: string;
  order: number;
}

export interface Property {
  id: string;
  title: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  pricePerWeek: number;
  rooms: number;
  maxCapacity: number;
  amenities: string[];
  restrictions: { key: string; label: string; description: string }[];
  status: PropertyStatus;
  owner: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
  photos: PropertyPhoto[];
  photoUrls: string[];
  contractTemplateId?: string;
  createdAt: string;
}

export interface Contract {
  id: string;
  title: string;
  status: string;
  content: string;
  signedDocumentKey?: string;
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

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface ChatSender {
  id: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  sender: ChatSender;
  senderRole: string;
  content: string;
  readAt: string | null;
  createdAt: string;
}

export interface ChatConversation {
  id: string;
  userId: string;
  user: ChatSender & { email: string };
  status: 'OPEN' | 'CLOSED';
  messages?: ChatMessage[];
  lastMessage?: ChatMessage | null;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
