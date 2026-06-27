import type { AxiosError } from 'axios';

export function getApiErrorMessage(err: unknown, fallback = 'Ocurrió un error'): string {
  const axiosErr = err as AxiosError<{ message?: string }>;
  return (
    axiosErr?.response?.data?.message ??
    (err instanceof Error ? err.message : null) ??
    fallback
  );
}
