import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  createColumnHelper,
  functionalUpdate,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
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
  Skeleton,
  Spinner,
} from '@/shared/ui';

const webhookTableFeatures = tableFeatures({ rowPaginationFeature, rowSortingFeature });
const webhookColumnHelper = createColumnHelper<typeof webhookTableFeatures, TWebhook>();
const emptyWebhooks: TWebhook[] = [];

const SortIcon = ({ direction }: { direction: false | 'asc' | 'desc' }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    className={`size-4 transition-colors ${direction ? 'text-primary' : 'text-muted-foreground/60'}`}
  >
    {direction === 'asc' ? (
      <path
        d="m4 10 4-4 4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : direction === 'desc' ? (
      <path
        d="m4 6 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="m4 6 4-3 4 3M4 10l4 3 4-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

export const WebhooksPage = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [editing, setEditing] = useState<TWebhook | null>(null);
  const page = Math.max(1, Number(params.get('page')) || 1);
  const search = params.get('search') ?? '';
  const sortParam = params.get('sort');
  const sort =
    sortParam === 'name' || sortParam === 'url' || sortParam === 'active' ? sortParam : null;
  const direction = params.get('direction') === 'desc' ? 'desc' : 'asc';
  const sorting = sort ? [{ id: sort, desc: direction === 'desc' }] : [];
  const { data, isLoading, isError } = useWebhooks({
    page,
    limit: 10,
    search,
    ...(sort ? { sort, direction } : {}),
  });
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
  const update = (next: { page?: number; search?: string }) =>
    setParams(current => {
      const merged = { page, search, ...next };
      if (next.search !== undefined) merged.page = 1;
      if (merged.page > 1) current.set('page', String(merged.page));
      else current.delete('page');
      if (merged.search) current.set('search', merged.search);
      else current.delete('search');
      return current;
    });
  const columns = useMemo(
    () =>
      webhookColumnHelper.columns([
        webhookColumnHelper.accessor('name', { header: 'Name', enableSorting: true }),
        webhookColumnHelper.accessor('url', { header: 'URL', enableSorting: true }),
        webhookColumnHelper.accessor('active', {
          header: 'Status',
          enableSorting: true,
          cell: ({ row }) => (
            <Badge variant={row.original.active ? 'default' : 'outline'}>
              <span
                className={`mr-1.5 size-1.5 rounded-full ${row.original.active ? 'bg-emerald-500' : 'bg-slate-400'}`}
              />
              {row.original.active ? 'Active' : 'Inactive'}
            </Badge>
          ),
        }),
        webhookColumnHelper.display({
          id: 'actions',
          header: 'Actions',
          cell: ({ row }) => (
            <Button
              variant="ghost"
              className="h-9 px-3 text-primary"
              onClick={() => {
                resetWebhook();
                setEditing(row.original);
              }}
            >
              Edit
            </Button>
          ),
        }),
      ]),
    [resetWebhook],
  );
  const table = useTable(
    {
      features: webhookTableFeatures,
      columns,
      data: data?.data ?? emptyWebhooks,
      rowCount: data?.paging.results.total ?? 0,
      manualPagination: true,
      manualSorting: true,
      state: { pagination: { pageIndex: page - 1, pageSize: 10 }, sorting },
      onPaginationChange: updater =>
        setParams(current => {
          const currentPage = Math.max(1, Number(current.get('page')) || 1);
          const nextPage =
            functionalUpdate(updater, { pageIndex: currentPage - 1, pageSize: 10 }).pageIndex + 1;
          if (nextPage > 1) current.set('page', String(nextPage));
          else current.delete('page');
          return current;
        }),
      onSortingChange: updater =>
        setParams(current => {
          const currentSort = current.get('sort');
          const currentDirection = current.get('direction') === 'desc';
          const currentState =
            currentSort === 'name' || currentSort === 'url' || currentSort === 'active'
              ? [{ id: currentSort, desc: currentDirection }]
              : [];
          const next = functionalUpdate(updater, currentState);
          const first = next[0];
          if (first && (first.id === 'name' || first.id === 'url' || first.id === 'active')) {
            current.set('sort', first.id);
            current.set('direction', first.desc ? 'desc' : 'asc');
          } else {
            current.delete('sort');
            current.delete('direction');
          }
          current.delete('page');
          return current;
        }),
    },
    state => ({ pagination: state.pagination }),
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
              onChange={event => update({ search: event.target.value })}
              placeholder="Search by name"
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {isLoading ? (
            <div
              className="space-y-0 px-5 py-3 sm:px-7"
              role="status"
              aria-label="Loading webhooks"
            >
              <span className="sr-only">Loading webhooks</span>
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 items-center gap-4 border-b py-5 last:border-0"
                >
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="ml-auto h-8 w-14" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <p
              role="alert"
              className="mx-6 my-8 rounded-xl bg-destructive/10 p-4 text-sm text-destructive"
            >
              Could not load webhooks. Please try again.
            </p>
          ) : table.getRowModel().rows.length ? (
            <>
              <div className="overflow-x-auto">
                <Table className="min-w-170">
                  <TableHeader>
                    {table.getHeaderGroups().map(group => (
                      <TableRow key={group.id} className="bg-muted/40 hover:bg-muted/40">
                        {group.headers.map(header => (
                          <TableHead
                            key={header.id}
                            aria-sort={
                              header.column.getIsSorted() === 'asc'
                                ? 'ascending'
                                : header.column.getIsSorted() === 'desc'
                                  ? 'descending'
                                  : 'none'
                            }
                            className={
                              header.column.id === 'name'
                                ? 'pl-7'
                                : header.column.id === 'actions'
                                  ? 'pr-7 text-right'
                                  : undefined
                            }
                          >
                            {header.isPlaceholder ? null : header.column.getCanSort() ? (
                              <button
                                type="button"
                                onClick={header.column.getToggleSortingHandler()}
                                className="inline-flex cursor-pointer items-center gap-2"
                                aria-label={`Sort by ${String(header.column.columnDef.header)}`}
                              >
                                <table.FlexRender header={header} />
                                <SortIcon direction={header.column.getIsSorted()} />
                              </button>
                            ) : (
                              <table.FlexRender header={header} />
                            )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.map(row => (
                      <TableRow key={row.id} data-testid="webhook-row">
                        {row.getAllCells().map(cell => (
                          <TableCell
                            key={cell.id}
                            className={
                              cell.column.id === 'name'
                                ? 'pl-7 font-semibold text-foreground'
                                : cell.column.id === 'url'
                                  ? 'max-w-90 truncate text-muted-foreground'
                                  : cell.column.id === 'actions'
                                    ? 'pr-7 text-right'
                                    : undefined
                            }
                          >
                            <table.FlexRender cell={cell} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <footer className="flex flex-col gap-3 border-t border-border/70 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <span className="text-muted-foreground">
                  Page {table.state.pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="h-9 px-4"
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.previousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="h-9 px-4"
                    disabled={!table.getCanNextPage()}
                    onClick={() => table.nextPage()}
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
