import type { LinkProps } from 'node_modules/svelte-routing/types/Link';
import type {
  ClassValue,
  HTMLButtonAttributes,
} from 'svelte/elements';
import type { HTMLWithChildren, LucideIconProps } from '~/lib/types';

export type NavRootProps = HTMLWithChildren & {
  collapsed?: boolean;
  pathname?: string;
  actionId?: string | null;
};

export type NavItemProps = LinkProps & {
  icon?: LucideIconProps;
  label: string;
  to: string;
  active?: boolean;
  class?: ClassValue;
};

export type NavContextValue = {
  getCollapsed: () => boolean;
  getPathname: () => string;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
  // getActionId: () => string | null;
  // setActionId: (actionId: string | null) => void;
  // registerPanel: (actionId: string, panel: SidebarPanel) => () => void;
};

export type NavCollapseTriggerProps = HTMLButtonAttributes & {
  label?: string;
};
