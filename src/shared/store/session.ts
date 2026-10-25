import { create } from 'zustand';
import type { ISessionState } from './types';

export const useSessionStore = create<ISessionState>(set => ({
  signedIn: false,
  sessionExpired: false,
  setSignedIn: signedIn =>
    set(state => ({
      signedIn,
      sessionExpired: signedIn ? false : state.sessionExpired,
    })),
  setSessionExpired: sessionExpired => set({ sessionExpired }),
}));
