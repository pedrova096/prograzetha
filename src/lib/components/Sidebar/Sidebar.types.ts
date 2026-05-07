import type { ComponentType, Snippet, SvelteComponent } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { IconProps } from 'lucide-svelte';

export type SidebarIcon = ComponentType<SvelteComponent<IconProps>>;

export type SidebarPanel = {
  id: string;
  title?: string;
  actions?: Snippet;
  content: Snippet;
};

export type SidebarContextValue = {
  getCollapsed: () => boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
  getPanel: () => SidebarPanel | null;
  setPanel: (panel: SidebarPanel | null) => void;
};

export interface SidebarRootProps extends HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
  panel?: SidebarPanel | null;
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
  icon?: SidebarIcon;
  label: string;
  active?: boolean;
  badge?: string | number;
}

export interface SidebarActionProps extends SidebarItemProps {
  panel?: Snippet;
  panelTitle?: string;
  panelActions?: Snippet;
  path?: string;
  closePath?: string;
}

export interface SidebarCollapseTriggerProps extends HTMLButtonAttributes {
  label?: string;
}
