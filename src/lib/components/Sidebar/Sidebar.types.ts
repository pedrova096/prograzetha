import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { LucideIconProps } from '~/lib/types';

export type SidebarPanel = {
  title?: string;
  actions?: Snippet;
  content: Snippet;
};

export type SidebarContextValue = {
  getCollapsed: () => boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
  getActionId: () => string | null;
  setActionId: (actionId: string | null) => void;
  registerPanel: (actionId: string, panel: SidebarPanel) => () => void;
};

export interface SidebarRootProps extends HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
  actionId?: string | null;
  children: Snippet;
}

export interface SidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: Snippet;
}

export interface SidebarContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: Snippet;
}

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: Snippet;
}

export interface SidebarDividerProps extends HTMLAttributes<HTMLDivElement> {}

export interface SidebarItemProps extends HTMLButtonAttributes {
  icon?: LucideIconProps;
  label: string;
  active?: boolean;
  badge?: string | number;
}

export interface SidebarActionProps extends SidebarItemProps {
  id: string;
  panel?: Snippet;
  panelTitle?: string;
  panelActions?: Snippet;
  defaultOpenPanel?: boolean;
}

export interface SidebarCollapseTriggerProps extends HTMLButtonAttributes {
  label?: string;
}
