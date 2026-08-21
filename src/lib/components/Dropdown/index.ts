import Root from './Dropdown.svelte';
import Trigger from './DropdownTrigger.svelte';
import Content from './DropdownContent.svelte';
import Item from './DropdownItem.svelte';

export const Dropdown = { Root, Trigger, Content, Item };

export type {
  DropdownOption,
  DropdownOptionGroup,
  DropdownEntry,
  RootProps,
  TriggerProps,
  ContentProps,
  ItemProps,
} from './Dropdown.types';
