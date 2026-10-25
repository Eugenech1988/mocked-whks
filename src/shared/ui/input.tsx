import type { InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib';

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      'flex h-11 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm shadow-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/10',
      className,
    )}
    {...props}
  />
);
