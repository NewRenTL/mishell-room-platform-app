import type { User } from './user';

export type RegRole = 'INQUILINO' | 'SOCIO';

export interface AuthResponse {
  accessToken: string;
  user: User;
}
