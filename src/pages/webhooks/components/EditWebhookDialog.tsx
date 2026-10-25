import { Controller, useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateWebhookSchema, type TUpdateWebhookFormValues } from '@/features/edit-webhook';
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
  Spinner,
} from '@/shared/ui';
import type { TEditWebhookDialogProps } from './types';

export const EditWebhookDialog = ({
  webhook,
  errors,
  onOpenChange,
  onSave,
}: TEditWebhookDialogProps) => {
  const { register, control, handleSubmit } = useForm<TUpdateWebhookFormValues>({
    resolver: zodResolver(updateWebhookSchema),
    mode: 'onTouched',
    defaultValues: {
      name: webhook?.name ?? '',
      url: webhook?.url ?? '',
      active: webhook?.active ?? false,
    },
  });
  const { errors: formErrors, isSubmitting } = useFormState({ control });

  const submit = handleSubmit(async values => {
    if (webhook) await onSave({ id: webhook.id, ...values });
  });

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
          <form id="edit-webhook-form" className="space-y-5" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="webhook-name">Name</Label>
              <Input
                id="webhook-name"
                {...register('name')}
                aria-invalid={!!formErrors.name || !!errors.name}
                aria-describedby={formErrors.name || errors.name ? 'webhook-name-error' : undefined}
              />
              {(formErrors.name?.message || errors.name) && (
                <FieldError
                  id="webhook-name-error"
                  message={formErrors.name?.message ?? errors.name ?? ''}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL</Label>
              <Input
                id="webhook-url"
                type="url"
                {...register('url')}
                aria-invalid={!!formErrors.url || !!errors.url}
                aria-describedby={formErrors.url || errors.url ? 'webhook-url-error' : undefined}
              />
              {(formErrors.url?.message || errors.url) && (
                <FieldError
                  id="webhook-url-error"
                  message={formErrors.url?.message ?? errors.url ?? ''}
                />
              )}
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
              <div className="space-y-1">
                <Label htmlFor="webhook-active">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Choose whether this webhook receives events.
                </p>
              </div>
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="webhook-active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    aria-label="Webhook active"
                  />
                )}
              />
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="edit-webhook-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner />
                <span className="sr-only">Saving changes</span>
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
