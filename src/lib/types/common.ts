import type { IconProps } from '@lucide/svelte';
import type {
  Component,
  ComponentType,
  Snippet,
  SvelteComponent,
} from 'svelte';

import type { Edge } from '../modules/edge';
import type { Node } from '../modules/nodes';
import type { HTMLAttributes } from 'svelte/elements';

export type Recordable<T = any> = Record<string, T>;

export type Graph = {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
};

export type LucideIconProps = Component<IconProps>;

export type HTMLWithChildren<T extends HTMLElement = HTMLElement> =
  HTMLAttributes<T> & {
    children?: Snippet;
  };
