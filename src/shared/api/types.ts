import type { InternalAxiosRequestConfig } from 'axios'

export type TRetryableConfig = InternalAxiosRequestConfig & {
  _csrfRetried?: boolean
  _authRetried?: boolean
}

export type TValidationPayload = Record<string, string[]>
export type TFieldErrorMessages = Record<string, string>

export type TApiError = {
  type: string
  message: string
  payload?: TValidationPayload
}

export type TApiErrorResponse = {
  error: TApiError
}
