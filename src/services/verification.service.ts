import api from './api';

export interface VerificationStatus {
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'APPROVED' | 'OBSERVED';
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

export const verificationService = {
  getMyStatus: () =>
    api.get<VerificationStatus>('/verification-requests/my-status'),

  submit: () =>
    api.post('/verification-requests'),
};
