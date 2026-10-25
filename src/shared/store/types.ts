export type TSessionState = {
  sessionExpired: boolean;
  setSessionExpired: (sessionExpired: boolean) => void;
};
