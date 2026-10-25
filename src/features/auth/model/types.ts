export type TUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
};

export type TLoginCredentials = {
  email: string;
  password: string;
};

export type TLoginRequest = TLoginCredentials & {
  fingerprint: string;
};

export type TLoginResponse = {
  device_session_token: string;
};

export type TTokenIssueRequest = {
  device_session_token: string;
  fingerprint: string;
};

export type TTokenFingerprintRequest = {
  fingerprint: string;
};
