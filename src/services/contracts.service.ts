import api from './api';

export const contractsService = {
  getOne: (id: string) =>
    api.get<{ data: { id: string; content: string; status: string } }>(`/contracts/${id}`),

  sign: (contractId: string, signatureId: string) =>
    api.post(`/contracts/${contractId}/sign`, { signatureId }),

  getDownloadUrl: (contractId: string) =>
    api.get<{ data: { url: string } }>(`/contracts/${contractId}/download`),
};
