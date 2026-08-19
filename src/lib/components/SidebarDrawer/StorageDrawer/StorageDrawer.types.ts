import type { SidebarActionProps } from '../../Sidebar';

export interface StorageDrawerProps extends Pick<
  SidebarActionProps,
  'active' | 'defaultOpenPanel' | 'onclick'
> {}
