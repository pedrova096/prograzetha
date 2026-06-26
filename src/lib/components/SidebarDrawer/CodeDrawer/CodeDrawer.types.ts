import type { SidebarActionProps } from '../../Sidebar';

export interface CodeDrawerProps extends Pick<
  SidebarActionProps,
  'active' | 'defaultOpenPanel' | 'onclick'
> {}

export enum CodeLanguage {
  JavaScript = 'javascript',
  Python = 'python',
}
