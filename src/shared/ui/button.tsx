import { Button as ButtonPrimitive } from '@base-ui/react/button';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib';
import { buttonVariants } from './buttonVariants';
export const Button = ({
  className,
  variant,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) => (
  <ButtonPrimitive className={cn(buttonVariants({ variant, className }))} {...props} />
);
