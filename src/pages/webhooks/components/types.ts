import type { TWebhook } from '@/entities/webhook'
import type { TFieldErrorMessages } from '@/shared/api'
import type { TUpdateWebhookInput } from '@/features/edit-webhook/types'

export type TEditWebhookDialogProps = {
  webhook: TWebhook | null
  errors: TFieldErrorMessages
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSave: (payload: TUpdateWebhookInput) => Promise<void>
}
