import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/api'
import type { TWebhook, TWebhookList, TWebhookParams } from '@/entities'

export const webhookKeys = {
  all: ['webhooks'] as const,
  lists: () => [...webhookKeys.all, 'list'] as const,
  list: (params: TWebhookParams) => [...webhookKeys.lists(), params] as const,
  detail: (id: number) => [...webhookKeys.all, 'detail', id] as const,
}

export function useWebhooks(params: TWebhookParams) {
  return useQuery({
    queryKey: webhookKeys.list(params),
    queryFn: async () => (await api.get<TWebhookList>('/v1/webhooks', { params })).data,
  })
}

export function useWebhook(id: number) {
  return useQuery({
    queryKey: webhookKeys.detail(id),
    queryFn: async () => (await api.get<TWebhook>(`/v1/webhooks/${id}`)).data,
  })
}
