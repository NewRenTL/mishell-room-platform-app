import api from './api';
import type { VerificationStatusResponse } from '../types';

export const verificationService = {
  getMyStatus: () =>
    api.get<VerificationStatusResponse>('/verification-requests/my-status'),

  submit: () =>
    api.post('/verification-requests'),
};
