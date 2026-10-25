import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib';
import type { TDialogContentProps, TDialogDescriptionProps, TDialogTitleProps } from './types';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogContent = ({ className, children, ...props }: TDialogContentProps) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Backdrop className="fixed inset-0 z-40 bg-[#202124]/40 backdrop-blur-[2px] transition-opacity duration-200 ease-out data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
    <DialogPrimitive.Popup
      className={cn(
        'fixed left-1/2 top-1/2 z-50 max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border bg-card text-card-foreground shadow-2xl outline-none transition-[opacity,transform] duration-200 ease-out data-[ending-style]:scale-[.98] data-[ending-style]:opacity-0 data-[starting-style]:scale-[.98] data-[starting-style]:opacity-0',
        className,
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Popup>
  </DialogPrimitive.Portal>
);
export const DialogHeader = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('flex flex-col gap-2 p-6 pb-4', className)} {...props} />
);
export const DialogTitle = ({ className, ...props }: TDialogTitleProps) => (
  <DialogPrimitive.Title
    className={cn('text-xl font-semibold tracking-tight', className)}
    {...props}
  />
);
export const DialogDescription = ({ className, ...props }: TDialogDescriptionProps) => (
  <DialogPrimitive.Description
    className={cn('text-sm leading-6 text-muted-foreground', className)}
    {...props}
  />
);
export const DialogBody = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('px-6 pb-6', className)} {...props} />
);
export const DialogFooter = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    className={cn(
      'flex flex-col-reverse gap-2 border-t bg-muted/30 px-6 py-4 sm:flex-row sm:justify-end',
      className,
    )}
    {...props}
  />
);
