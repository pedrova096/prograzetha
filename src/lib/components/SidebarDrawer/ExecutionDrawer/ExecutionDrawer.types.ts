import type { SidebarActionProps } from '../../Sidebar';

export interface ExecutionDrawerProps
  extends Pick<
    SidebarActionProps,
    'active' | 'defaultOpenPanel' | 'onclick'
  > {}
