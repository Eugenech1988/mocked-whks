import {
  functionalUpdate,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { useSearchParams } from 'react-router-dom';
import type { TWebhookParams, TWebhookSortField } from '@/entities/webhook';

const isWebhookSortField = (value: string | null): value is TWebhookSortField =>
  value === 'name' || value === 'url' || value === 'active';

export const useWebhookListState = () => {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get('page')) || 1);
  const search = params.get('search') ?? '';
  const sortParam = params.get('sort');
  const sort = isWebhookSortField(sortParam) ? sortParam : null;
  const direction = params.get('direction') === 'desc' ? 'desc' : 'asc';
  const sorting: SortingState = sort ? [{ id: sort, desc: direction === 'desc' }] : [];

  const setSearch = (value: string) =>
    setParams(current => {
      if (value) current.set('search', value);
      else current.delete('search');
      current.delete('page');
      return current;
    });

  const onPaginationChange: OnChangeFn<PaginationState> = updater =>
    setParams(current => {
      const currentPage = Math.max(1, Number(current.get('page')) || 1);
      const nextPage =
        functionalUpdate(updater, { pageIndex: currentPage - 1, pageSize: 10 }).pageIndex + 1;
      if (nextPage > 1) current.set('page', String(nextPage));
      else current.delete('page');
      return current;
    });

  const onSortingChange: OnChangeFn<SortingState> = updater =>
    setParams(current => {
      const currentSort = current.get('sort');
      const currentDirection = current.get('direction') === 'desc';
      const currentState: SortingState = isWebhookSortField(currentSort)
        ? [{ id: currentSort, desc: currentDirection }]
        : [];
      const first = functionalUpdate(updater, currentState)[0];
      if (first && isWebhookSortField(first.id)) {
        current.set('sort', first.id);
        current.set('direction', first.desc ? 'desc' : 'asc');
      } else {
        current.delete('sort');
        current.delete('direction');
      }
      current.delete('page');
      return current;
    });

  const queryParams: TWebhookParams = {
    page,
    limit: 10,
    search,
    ...(sort ? { sort, direction } : {}),
  };

  return { page, search, sorting, queryParams, setSearch, onPaginationChange, onSortingChange };
};
