import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib';

export const Badge = ({
  className,
  variant = 'default',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'secondary' | 'outline' }) => {
  const variants = {
    default: 'border-transparent bg-primary/10 text-primary',
    secondary: 'border-transparent bg-secondary text-secondary-foreground',
    outline: 'border-border bg-transparent text-muted-foreground',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-none',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
};
