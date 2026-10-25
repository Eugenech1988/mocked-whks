import { create } from 'zustand';
import type { TSessionState } from './types';

export const useSessionStore = create<TSessionState>(set => ({
  sessionExpired: false,
  setSessionExpired: sessionExpired => set({ sessionExpired }),
}));
