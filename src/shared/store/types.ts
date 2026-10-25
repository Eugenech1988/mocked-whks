export interface ISessionState {
  signedIn: boolean
  sessionExpired: boolean
  setSignedIn: (signedIn: boolean) => void
  setSessionExpired: (sessionExpired: boolean) => void
}
