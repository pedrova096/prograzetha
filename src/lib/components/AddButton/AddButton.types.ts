import type { DropdownOption } from '~/lib/components/Dropdown';
import type { HTMLAttributes } from 'svelte/elements';

export interface AddButtonProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  triggerLabel?: string;
  onSelect?: (event: MouseEvent, option: DropdownOption) => void;
}
