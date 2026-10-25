import axios, { type AxiosError } from 'axios';
import { QueryClient } from '@tanstack/react-query';
import type { TRetryableConfig } from './types';
import { useSessionStore } from '@/shared/store';

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 30_000 } },
});
export const api = axios.create({
  baseURL: '/',
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

let csrfToken: string | null = null;
let rotatePromise: Promise<void> | null = null;
let csrfPromise: Promise<string | null> | null = null;
const FINGERPRINT_KEY = 'smart-sender:fingerprint';
// only for test
let sessionActive = false;

export const setSessionActive = (active: boolean) => {
  sessionActive = active;
};

export const getDeviceFingerprint = () => {
  let value = localStorage.getItem(FINGERPRINT_KEY);
  if (!value) {
    value = Array.from(crypto.getRandomValues(new Uint8Array(16)), byte =>
      byte.toString(16).padStart(2, '0'),
    ).join('');
    localStorage.setItem(FINGERPRINT_KEY, value);
  }
  return value;
};

const getCsrf = async () => {
  if (csrfToken) return csrfToken;
  csrfPromise ??= api.get('/csrf')
    .then(response => {
      csrfToken = response.headers['x-csrf-token'] ?? null;
      return csrfToken;
    })
    .finally(() => {
      csrfPromise = null;
    });
  return csrfPromise;
};

api.interceptors.request.use(async config => {
  if (config.url !== '/csrf') {
    const token = await getCsrf();
    if (['post', 'put'].includes((config.method ?? '').toLowerCase()) && token)
      config.headers.set('X-CSRF-TOKEN', token);
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const config = error.config as TRetryableConfig | undefined;
    if (error.response?.status === 419 && config && !config._csrfRetried) {
      config._csrfRetried = true;
      csrfToken = null;
      csrfPromise = null;
      await getCsrf();
      return api(config);
    }
    if (
      error.response?.status === 401 &&
      config &&
      sessionActive &&
      !config._authRetried &&
      config.url !== '/auth/token/rotate'
    ) {
      config._authRetried = true;
      try {
        rotatePromise ??= api.post('/auth/token/rotate', { fingerprint: getDeviceFingerprint() })
          .then(() => undefined)
          .finally(() => {
            rotatePromise = null;
          });
        await rotatePromise;
        return api(config);
      } catch {
        sessionActive = false;
        queryClient.clear();
        useSessionStore.getState().setSessionExpired(true);
        return Promise.reject(error);
      }
    }
    if (
      error.response?.status === 401 &&
      config?._authRetried &&
      config.url !== '/auth/token/rotate'
    ) {
      sessionActive = false;
      queryClient.clear();
      useSessionStore.getState().setSessionExpired(true);
    }
    return Promise.reject(error);
  },
);
