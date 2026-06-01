import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { Props as TippyProps } from 'tippy.js';
import type { LucideIconProps } from '~/lib/types';

export interface DropdownOption<T = string> {
  label: string;
  value: T;
  icon?: LucideIconProps;
  onclick?: (event: MouseEvent, option: DropdownOption<T>) => void;
  disabled?: boolean;
}

export interface RootProps<T = string> {
  children: Snippet;
  open?: boolean;
  offset?: TippyProps['offset'];
  onSelected?: (event: MouseEvent, option: DropdownOption<T>) => void;
}

export interface TriggerProps extends HTMLButtonAttributes {
  children?: Snippet;
}

export interface ContentProps<T = string> {
  options: DropdownOption<T>[];
  searchable?: boolean;
  clearable?: boolean;
  placeholder?: string;
  emptyText?: string;
}

export interface ItemProps<T = string> {
  value: T;
  label: string;
  icon?: LucideIconProps;
  onclick?: (event: MouseEvent, option: DropdownOption<T>) => void;
  disabled?: boolean;
  children?: Snippet;
}

export interface DropdownContextValue<T = string> {
  close: () => void;
  toggle: () => void;
  onSelect: (event: MouseEvent, option: DropdownOption<T>) => void;
  setTriggerRef: (element: HTMLElement) => void;
  setContentRef: (element: HTMLElement) => void;
}
