import type { DropdownOption } from '~/lib/components/Dropdown';
import type { LucideIconProps } from '~/lib/types';
import type { HTMLAttributes } from 'svelte/elements';

export interface AddButtonProps extends HTMLAttributes<HTMLDivElement> {
  icon?: LucideIconProps;
  open?: boolean;
  triggerLabel?: string;
  onSelected?: (event: MouseEvent, option: DropdownOption) => void;
}
