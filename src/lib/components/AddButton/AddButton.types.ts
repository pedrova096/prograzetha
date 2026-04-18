import type { DropdownOption } from '~/lib/components/Dropdown';

export interface AddButtonProps {
  circle?: boolean;
  onSelect?: (event: MouseEvent, option: DropdownOption) => void;
}
