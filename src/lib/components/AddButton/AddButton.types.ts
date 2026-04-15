import type { DropdownOption } from '~/lib/components/Dropdown';

export interface AddButtonProps {
  onSelect?: (event: MouseEvent, option: DropdownOption) => void;
}
