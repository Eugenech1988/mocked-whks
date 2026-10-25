import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib';

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <section
    className={cn(
      'rounded-2xl border bg-card text-card-foreground shadow-[0_2px_8px_rgba(30,64,175,0.06)]',
      className,
    )}
    {...props}
  />
);
export const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />
);
export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn('text-lg font-semibold leading-tight tracking-tight', className)} {...props} />
);
export const CardDescription = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm leading-6 text-muted-foreground', className)} {...props} />
);
export const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-6 pb-6', className)} {...props} />
);
export const CardFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center px-6 pb-6', className)} {...props} />
);
