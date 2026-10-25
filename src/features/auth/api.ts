import { api, getDeviceFingerprint, setSessionActive } from '@/shared/api';
import type {
  TLoginRequest,
  TLoginResponse,
  TTokenIssueRequest,
  TTokenFingerprintRequest,
  TUser,
} from './model/types';

export const login = async (email: string, password: string) => {
  const fingerprint = getDeviceFingerprint();
  const body: TLoginRequest = { email, password, fingerprint };
  const { data } = await api.post<TLoginResponse>('/auth/login', body, {
    headers: { 'X-Captcha-Token': 'demo-captcha' },
  });
  const issueBody: TTokenIssueRequest = {
    device_session_token: data.device_session_token,
    fingerprint,
  };
  await api.post('/auth/token/issue', issueBody);
  setSessionActive(true);
  return (await api.get<TUser>('/v1/me')).data;
};

export const logout = async () => {
  const body: TTokenFingerprintRequest = { fingerprint: getDeviceFingerprint() };
  try {
    await api.post('/auth/token/revoke', body);
  } finally {
    setSessionActive(false);
  }
};
