import type { ComponentProps } from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { Switch as SwitchPrimitive } from '@base-ui/react/switch';

export type TDialogContentProps = Omit<
  ComponentProps<typeof DialogPrimitive.Popup>,
  'className'
> & { className?: string };
export type TDialogTitleProps = Omit<ComponentProps<typeof DialogPrimitive.Title>, 'className'> & {
  className?: string;
};
export type TDialogDescriptionProps = Omit<
  ComponentProps<typeof DialogPrimitive.Description>,
  'className'
> & { className?: string };
export type TSwitchProps = Omit<ComponentProps<typeof SwitchPrimitive.Root>, 'className'> & {
  className?: string;
};
