import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib';

export const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="skeleton"
    aria-hidden="true"
    className={cn('animate-pulse rounded-md bg-muted', className)}
    {...props}
  />
);
