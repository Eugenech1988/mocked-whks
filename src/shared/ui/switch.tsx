import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import { cn } from '@/shared/lib'
import type { TSwitchProps } from './types'

export function Switch({ className, ...props }: TSwitchProps) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-input transition-colors outline-none focus-visible:ring-4 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 data-checked:bg-primary',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-5 translate-x-0.5 rounded-full bg-white shadow-sm ring-0 transition-transform data-checked:translate-x-[22px]" />
    </SwitchPrimitive.Root>
  )
}
