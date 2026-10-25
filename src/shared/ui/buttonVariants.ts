import { cva } from 'class-variance-authority';

export const BUTTON_VARIANTS = cva(
  'inline-flex h-11 cursor-pointer items-center justify-center rounded-lg px-5 text-sm font-semibold tracking-[0.01em] transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 active:translate-y-px disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md',
        outline: 'border border-border bg-card text-foreground shadow-sm hover:bg-muted',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/75',
        ghost: 'text-foreground hover:bg-muted',
        destructive: 'bg-destructive text-white shadow-sm hover:bg-destructive/90',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);
