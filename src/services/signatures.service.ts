import api from './api';

export const signaturesService = {
  upload: (dataUrl: string) => {
    const blob = dataURLtoBlob(dataUrl);
    const form = new FormData();
    form.append('signature', blob, 'signature.png');
    return api.post<{ id: string; imageKey: string }>('/signatures/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getDefault: () =>
    api.get<{ id: string; imageKey: string } | null>('/signatures/my/default'),
};

function dataURLtoBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/png';
  const bytes = atob(data);
  const buffer = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) buffer[i] = bytes.charCodeAt(i);
  return new Blob([buffer], { type: mime });
}
