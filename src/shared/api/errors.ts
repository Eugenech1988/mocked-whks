import { isAxiosError } from 'axios';
import type { TApiErrorResponse, TFieldErrorMessages } from './types';

export const getFieldErrors = (error: unknown): TFieldErrorMessages => {
  if (!isAxiosError<TApiErrorResponse>(error)) return {};
  return Object.fromEntries(
    Object.entries(error.response?.data?.error.payload ?? {}).map(([field, messages]) => [
      field,
      messages[0] ?? 'Invalid value.',
    ]),
  );
};
