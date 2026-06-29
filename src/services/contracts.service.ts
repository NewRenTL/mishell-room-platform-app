import api from './api';

export const contractsService = {
  getOne: (id: string) =>
    api.get<{ id: string; content: string; status: string }>(`/contracts/${id}`),

  sign: (contractId: string, signatureId: string) =>
    api.post(`/contracts/${contractId}/sign`, { signatureId }),

  getDownloadUrl: (contractId: string) =>
    api.get<{ url: string }>(`/contracts/${contractId}/download`),
};
