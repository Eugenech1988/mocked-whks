import { useMemo } from 'react';
import {
  createColumnHelper,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import type { TWebhook } from '@/entities/webhook';
import {
  Badge,
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui';

type TWebhookTableProps = {
  data?: TWebhook[];
  total: number;
  page: number;
  sorting: SortingState;
  isLoading: boolean;
  isError: boolean;
  onPaginationChange: OnChangeFn<PaginationState>;
  onSortingChange: OnChangeFn<SortingState>;
  onEdit: (webhook: TWebhook) => void;
};

const WEBHOOK_TABLE_FEATURES = tableFeatures({ rowPaginationFeature, rowSortingFeature });
const WEBHOOK_COLUMN_HELPER = createColumnHelper<typeof WEBHOOK_TABLE_FEATURES, TWebhook>();
const EMPTY_WEBHOOKS: TWebhook[] = [];

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

export const WebhookTable = ({
  data,
  total,
  page,
  sorting,
  isLoading,
  isError,
  onPaginationChange,
  onSortingChange,
  onEdit,
}: TWebhookTableProps) => {
  const columns = useMemo(
    () =>
      WEBHOOK_COLUMN_HELPER.columns([
        WEBHOOK_COLUMN_HELPER.accessor('name', { header: 'Name', enableSorting: true }),
        WEBHOOK_COLUMN_HELPER.accessor('url', { header: 'URL', enableSorting: true }),
        WEBHOOK_COLUMN_HELPER.accessor('active', {
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
        WEBHOOK_COLUMN_HELPER.display({
          id: 'actions',
          header: 'Actions',
          cell: ({ row }) => (
            <Button
              variant="ghost"
              className="h-9 px-3 text-primary"
              onClick={() => onEdit(row.original)}
            >
              Edit
            </Button>
          ),
        }),
      ]),
    [onEdit],
  );

  const table = useTable(
    {
      features: WEBHOOK_TABLE_FEATURES,
      columns,
      data: data ?? EMPTY_WEBHOOKS,
      rowCount: total,
      manualPagination: true,
      manualSorting: true,
      state: { pagination: { pageIndex: page - 1, pageSize: 10 }, sorting },
      onPaginationChange,
      onSortingChange,
    },
    state => ({ pagination: state.pagination }),
  );

  if (isLoading)
    return (
      <div className="space-y-0 px-5 py-3 sm:px-7" role="status" aria-label="Loading webhooks">
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
    );

  if (isError)
    return (
      <p
        role="alert"
        className="mx-6 my-8 rounded-xl bg-destructive/10 p-4 text-sm text-destructive"
      >
        Could not load webhooks. Please try again.
      </p>
    );

  if (!table.getRowModel().rows.length)
    return (
      <div className="px-6 py-20 text-center">
        <div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-secondary text-2xl text-primary">
          ⌕
        </div>
        <h3 className="font-semibold">No webhooks found</h3>
        <p className="mt-1 text-sm text-muted-foreground">Try another search term.</p>
      </div>
    );

  return (
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
  );
};
