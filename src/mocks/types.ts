import type {
  TTokenFingerprintRequest,
  TTokenIssueRequest,
  TLoginRequest,
  TUser,
} from '@/features/auth';
import type { TWebhookUpdatePayload } from '@/entities/webhook';
import type { TValidationPayload } from '@/shared/api';

export type TMockSession = {
  fingerprint: string;
  expiresAt: number;
  revoked: boolean;
};

export type TMockCookies = Record<string, string>;
export type TMockLoginRequest = TLoginRequest;
export type TMockTokenIssueRequest = TTokenIssueRequest;
export type TMockTokenFingerprintRequest = TTokenFingerprintRequest;
export type TMockWebhookUpdateRequest = TWebhookUpdatePayload;
export type TMockUser = TUser;
export type TMockValidationPayload = TValidationPayload;
