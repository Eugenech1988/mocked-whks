export type TUpdateWebhookInput = {
  id: number;
  name: string;
  url: string;
  active: boolean;
};

export type TUpdateWebhookFormValues = Omit<TUpdateWebhookInput, 'id'>;
