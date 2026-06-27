import api from './api';
import type { User, AuthResponse } from '../types';

export const authService = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),

  loginByDni: (dni: string, pin: string) =>
    api.post<AuthResponse>('/auth/login-dni', { dni, pin }),

  register: (
    data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phone?: string;
      dni?: string;
      role?: 'INQUILINO' | 'SOCIO';
    },
    dniPhotoFront?: File,
    dniPhotoBack?: File,
  ) => {
    const form = new FormData();
    form.append('firstName', data.firstName);
    form.append('lastName', data.lastName);
    form.append('email', data.email);
    form.append('password', data.password);
    if (data.phone)        form.append('phone', data.phone);
    if (data.dni)          form.append('dni', data.dni);
    if (data.role)         form.append('role', data.role);
    if (dniPhotoFront)     form.append('dniPhotoFront', dniPhotoFront);
    if (dniPhotoBack)      form.append('dniPhotoBack', dniPhotoBack);
    return api.post<AuthResponse>('/auth/register', form);
  },

  registerByDni: (
    data: { firstName: string; lastName: string; dni: string; pin: string; phone?: string; role?: 'INQUILINO' | 'SOCIO' },
    dniPhoto?: File,
  ) => {
    const form = new FormData();
    form.append('firstName', data.firstName);
    form.append('lastName', data.lastName);
    form.append('dni', data.dni);
    form.append('pin', data.pin);
    if (data.phone) form.append('phone', data.phone);
    if (data.role) form.append('role', data.role);
    if (dniPhoto) form.append('dniPhoto', dniPhoto);
    return api.post<AuthResponse>('/auth/register-dni', form);
  },

  me: () => api.get<User>('/auth/me'),

  updateProfile: (data: { phone?: string; dni?: string }) =>
    api.patch<User>('/auth/profile', data),

  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<User & { avatarUrl: string }>('/auth/avatar', form);
  },
};
