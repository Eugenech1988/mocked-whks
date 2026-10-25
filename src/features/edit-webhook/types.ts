import type { TWebhook, TWebhookUpdatePayload } from '@/entities/webhook';
import type { TFieldErrorMessages } from '@/shared/api';

export type TUpdateWebhookInput = { id: number } & Required<TWebhookUpdatePayload>;

export type TUpdateWebhookFormValues = Omit<TUpdateWebhookInput, 'id'>;

export type TEditWebhookDialogProps = {
  webhook: TWebhook | null;
  errors: TFieldErrorMessages;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: TUpdateWebhookInput) => Promise<void>;
};
