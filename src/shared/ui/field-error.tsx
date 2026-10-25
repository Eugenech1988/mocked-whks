import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib'

type TFieldErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  message: string
}

export function FieldError({ className, message, ...props }: TFieldErrorProps) {
  return (
    <p
      className={cn(
        'validation-message flex items-start gap-2 rounded-lg border border-[#f4c7c3] bg-[#fce8e6] px-3 py-2 text-sm leading-5 text-[#b3261e]',
        className,
      )}
      role="alert"
      aria-live="polite"
      {...props}
    >
      <svg
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Zm0 7.25a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </p>
  )
}
