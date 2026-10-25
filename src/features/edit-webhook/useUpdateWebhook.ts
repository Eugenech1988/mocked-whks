import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { webhookKeys, type TWebhook } from '@/entities/webhook';
import type { TUpdateWebhookInput } from './types';

export const useUpdateWebhook = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: TUpdateWebhookInput) =>
      (await api.put<TWebhook>(`/v1/webhooks/${id}`, body)).data,
    onSuccess: webhook => {
      client.setQueryData(webhookKeys.detail(webhook.id), webhook);
      return client.invalidateQueries({ queryKey: webhookKeys.lists() });
    },
  });
};
