export type Role = 'ADMIN' | 'SOCIO' | 'INQUILINO' | 'SIGNER';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'APPROVED' | 'OBSERVED';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dni?: string;
  avatarKey?: string;
  avatarUrl?: string;
  role: Role;
  status: 'ACTIVE' | 'INACTIVE';
  mustChangePassword: boolean;
  verificationStatus?: VerificationStatus;
}
