import { Toaster as Sonner, type ToasterProps } from 'sonner';

export const Toaster = (props: ToasterProps) => (
  <Sonner
    richColors
    closeButton
    position="top-right"
    toastOptions={{
      classNames: {
        toast: 'rounded-xl border shadow-lg',
        title: 'font-semibold',
      },
    }}
    {...props}
  />
);
