import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useWebhooks, type TWebhook } from '@/entities/webhook';
import { useLogout } from '@/features/auth';
import {
  EditWebhookDialog,
  useUpdateWebhook,
  type TUpdateWebhookInput,
} from '@/features/edit-webhook';
import { getFieldErrors } from '@/shared/api';
import { WebhookTable } from './components/WebhookTable';
import { useWebhookListState } from './hooks/useWebhookListState';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Spinner,
} from '@/shared/ui';

export const WebhooksPage = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState<TWebhook | null>(null);
  const { page, search, sorting, queryParams, setSearch, onPaginationChange, onSortingChange } =
    useWebhookListState();
  const { data, isLoading, isError } = useWebhooks(queryParams);
  const updateWebhook = useUpdateWebhook();
  const resetWebhook = updateWebhook.reset;
  const logout = useLogout();
  const errors = getFieldErrors(updateWebhook.error);

  const save = async (payload: TUpdateWebhookInput) => {
    try {
      await updateWebhook.mutateAsync(payload);
      setEditing(null);
      toast.success('Webhook updated', { description: 'Your changes have been saved.' });
    } catch (error) {
      console.error('Webhook update failed:', error);
      toast.error('Could not save changes', {
        description: 'Check the highlighted fields and try again.',
      });
    }
  };
  const openEditor = useCallback(
    (webhook: TWebhook) => {
      resetWebhook();
      setEditing(webhook);
    },
    [resetWebhook],
  );
  const signOut = () =>
    logout.mutate(undefined, {
      onSuccess: () => toast.success('Signed out'),
      onError: error => {
        console.error('Logout failed:', error);
        toast.error('Could not sign out', { description: 'Your local session has been cleared.' });
      },
      onSettled: () => navigate('/login', { replace: true }),
    });

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            Smart Sender <span className="px-1 text-slate-300">/</span> Integrations
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Webhooks</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Manage the endpoints that receive and process your events.
          </p>
        </div>
        <Button variant="outline" onClick={signOut} disabled={logout.isPending}>
          {logout.isPending ? (
            <>
              <Spinner />
              <span className="sr-only">Signing out</span>
            </>
          ) : (
            'Sign out'
          )}
        </Button>
      </header>

      <Card className="overflow-hidden border-white shadow-[0_8px_32px_rgba(30,64,175,0.07)]">
        <CardHeader className="gap-5 border-b border-border/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
          <div>
            <CardTitle>Webhook endpoints</CardTitle>
            <CardDescription className="mt-1">
              {data?.paging.results.total ?? '—'} configured endpoints
            </CardDescription>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted-foreground"
            >
              ⌕
            </span>
            <Input
              aria-label="Search webhooks"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search by name"
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <WebhookTable
            data={data?.data}
            total={data?.paging.results.total ?? 0}
            page={page}
            sorting={sorting}
            isLoading={isLoading}
            isError={isError}
            onPaginationChange={onPaginationChange}
            onSortingChange={onSortingChange}
            onEdit={openEditor}
          />
        </CardContent>
      </Card>

      <EditWebhookDialog
        key={editing?.id ?? 'closed'}
        webhook={editing}
        errors={errors}
        onOpenChange={open => {
          if (!open) {
            setEditing(null);
            updateWebhook.reset();
          }
        }}
        onSave={save}
      />
    </main>
  );
};
