import Root from './Sidebar.svelte';
import Header from './SidebarHeader.svelte';
import Content from './SidebarContent.svelte';
import Group from './SidebarGroup.svelte';
import Divider from './SidebarDivider.svelte';
import Item from './SidebarItem.svelte';
import Action from './SidebarAction.svelte';
import CollapseTrigger from './SidebarCollapseTrigger.svelte';

export const Sidebar = {
  Root,
  Header,
  Content,
  Group,
  Divider,
  Item,
  Action,
  CollapseTrigger,
};

export type {
  SidebarActionProps,
  SidebarCollapseTriggerProps,
  SidebarContentProps,
  SidebarContextValue,
  SidebarDividerProps,
  SidebarGroupProps,
  SidebarHeaderProps,
  SidebarItemProps,
  SidebarPanel,
  SidebarRootProps,
} from './Sidebar.types';
