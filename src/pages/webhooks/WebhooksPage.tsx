import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useWebhooks, type TWebhook } from '@/entities/webhook';
import { useLogout } from '@/features/auth';
import { useUpdateWebhook, type TUpdateWebhookInput } from '@/features/edit-webhook';
import { getFieldErrors } from '@/shared/api';
import { EditWebhookDialog } from './components';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui';
import type { TWebhookListLocationUpdate } from './model/types';

export const WebhooksPage = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [editing, setEditing] = useState<TWebhook | null>(null);
  const page = Math.max(1, Number(params.get('page')) || 1);
  const search = params.get('search') ?? '';
  const { data, isLoading, isError } = useWebhooks({ page, limit: 10, search });
  const updateWebhook = useUpdateWebhook();
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
  const update = (next: TWebhookListLocationUpdate) =>
    setParams(current => {
      const merged = { page, search, ...next };
      if (next.search !== undefined) merged.page = 1;
      if (merged.page > 1) current.set('page', String(merged.page));
      else current.delete('page');
      if (merged.search) current.set('search', merged.search);
      else current.delete('search');
      return current;
    });
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
          {logout.isPending ? 'Signing out…' : 'Sign out'}
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
              onChange={event => update({ search: event.target.value })}
              placeholder="Search by name"
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {isLoading ? (
            <p className="py-20 text-center text-sm text-muted-foreground">Loading webhooks…</p>
          ) : isError ? (
            <p
              role="alert"
              className="mx-6 my-8 rounded-xl bg-destructive/10 p-4 text-sm text-destructive"
            >
              Could not load webhooks. Please try again.
            </p>
          ) : data?.data.length ? (
            <>
              <div className="overflow-x-auto">
                <Table className="min-w-[680px]">
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="pl-7">Name</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-7 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map(item => (
                      <TableRow key={item.id} data-testid="webhook-row">
                        <TableCell className="pl-7 font-semibold text-foreground">
                          {item.name}
                        </TableCell>
                        <TableCell className="max-w-[360px] truncate text-muted-foreground">
                          {item.url}
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.active ? 'default' : 'outline'}>
                            <span
                              className={`mr-1.5 size-1.5 rounded-full ${item.active ? 'bg-emerald-500' : 'bg-slate-400'}`}
                            />
                            {item.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-7 text-right">
                          <Button
                            variant="ghost"
                            className="h-9 px-3 text-primary"
                            onClick={() => {
                              updateWebhook.reset();
                              setEditing(item);
                            }}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <footer className="flex flex-col gap-3 border-t border-border/70 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <span className="text-muted-foreground">
                  Page {data.paging.pages.current} of {data.paging.pages.last}
                </span>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="h-9 px-4"
                    disabled={page <= 1}
                    onClick={() => update({ page: page - 1 })}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="h-9 px-4"
                    disabled={page >= data.paging.pages.last}
                    onClick={() => update({ page: page + 1 })}
                  >
                    Next
                  </Button>
                </div>
              </footer>
            </>
          ) : (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-secondary text-2xl text-primary">
                ⌕
              </div>
              <h3 className="font-semibold">No webhooks found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try another search term.</p>
            </div>
          )}
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
