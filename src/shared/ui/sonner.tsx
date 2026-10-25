import { Toaster as Sonner, type ToasterProps } from 'sonner'

export function Toaster(props: ToasterProps) {
  return (
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
  )
}
