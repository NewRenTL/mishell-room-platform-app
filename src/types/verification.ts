import type { VerificationStatus } from './user';

export interface VerificationStatusResponse {
  verificationStatus: VerificationStatus;
  observation: string | null;
  requestedAt: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    dni: string | null;
    phone: string | null;
    dniPhotoUrl: string | null;
  };
}
