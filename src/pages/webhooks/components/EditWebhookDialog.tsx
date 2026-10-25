import type { FormEvent } from 'react'
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FieldError,
  Input,
  Label,
  Switch,
} from '@/shared/ui'
import type { TEditWebhookDialogProps } from './types'

export function EditWebhookDialog({
  webhook,
  errors,
  isPending,
  onOpenChange,
  onSave,
}: TEditWebhookDialogProps) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!webhook) return

    const form = new FormData(event.currentTarget)
    return onSave({
      id: webhook.id,
      name: String(form.get('name')),
      url: String(form.get('url')),
      active: form.get('active') === 'true',
    })
  }

  return (
    <Dialog open={Boolean(webhook)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit webhook</DialogTitle>
          <DialogDescription>
            Update the name and destination URL for this endpoint.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <form
            key={webhook?.id ?? 'closed'}
            id="edit-webhook-form"
            className="space-y-5"
            onSubmit={submit}
          >
            <div className="space-y-2">
              <Label htmlFor="webhook-name">Name</Label>
              <Input
                id="webhook-name"
                name="name"
                required
                defaultValue={webhook?.name ?? ''}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'webhook-name-error' : undefined}
              />
              {errors.name && <FieldError id="webhook-name-error" message={errors.name} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL</Label>
              <Input
                id="webhook-url"
                name="url"
                type="url"
                required
                defaultValue={webhook?.url ?? ''}
                aria-invalid={!!errors.url}
                aria-describedby={errors.url ? 'webhook-url-error' : undefined}
              />
              {errors.url && <FieldError id="webhook-url-error" message={errors.url} />}
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
              <div className="space-y-1">
                <Label htmlFor="webhook-active">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Choose whether this webhook receives events.
                </p>
              </div>
              <Switch
                id="webhook-active"
                name="active"
                value="true"
                defaultChecked={webhook?.active ?? false}
                aria-label="Webhook active"
              />
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="edit-webhook-form" disabled={isPending}>
            {isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
