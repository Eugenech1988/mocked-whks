import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import type { TWebhookList, TWebhookParams } from './model/types';

export const WEBHOOK_KEYS = {
  all: ['webhooks'] as const,
  lists: () => [...WEBHOOK_KEYS.all, 'list'] as const,
  list: (params: TWebhookParams) => [...WEBHOOK_KEYS.lists(), params] as const,
  detail: (id: number) => [...WEBHOOK_KEYS.all, 'detail', id] as const,
};

export const useWebhooks = (params: TWebhookParams) =>
  useQuery({
    queryKey: WEBHOOK_KEYS.list(params),
    queryFn: async () => (await api.get<TWebhookList>('/v1/webhooks', { params })).data,
    placeholderData: keepPreviousData,
  });
