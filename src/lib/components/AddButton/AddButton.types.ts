import type { DropdownOption } from '~/lib/components/Dropdown';

export enum PathMode {
  FullPath = 'full-path',
  OnlyArrow = 'only-arrow',
  OnlyPath = 'only-path',
}

export interface AddButtonProps {
  pathMode?: `${PathMode}`;
  onSelect?: (event: MouseEvent, option: DropdownOption) => void;
}
