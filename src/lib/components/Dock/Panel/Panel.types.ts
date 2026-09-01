import type { HTMLWithChildren, LucideIconProps } from '~/lib/types';

export type PanelHeaderProps = HTMLWithChildren<HTMLHeadElement> & {
  icon?: LucideIconProps;
  label?: string;
};
export type PanelDividerProps = HTMLWithChildren<HTMLDivElement>;
export type PanelGroupProps = HTMLWithChildren<HTMLDivElement>;
