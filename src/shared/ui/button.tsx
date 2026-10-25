import { Button as ButtonPrimitive } from '@base-ui/react/button';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib';
import { BUTTON_VARIANTS } from './buttonVariants';
export const Button = ({
  className,
  variant,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof BUTTON_VARIANTS>) => (
  <ButtonPrimitive className={cn(BUTTON_VARIANTS({ variant, className }))} {...props} />
);
