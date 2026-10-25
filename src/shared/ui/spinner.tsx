import type { HTMLAttributes } from 'react';
import { Loader2Icon } from 'lucide-react';
import { cn } from '@/shared/lib';

export const Spinner = ({ className, ...props }: HTMLAttributes<SVGSVGElement>) => (
  <Loader2Icon
    data-slot="spinner"
    role="status"
    aria-label="Loading"
    className={cn('size-4 animate-spin', className)}
    {...props}
  />
);
