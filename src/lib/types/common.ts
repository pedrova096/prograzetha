import type { IconProps } from 'lucide-svelte';
import type { Component, ComponentType, SvelteComponent } from 'svelte';

import type { Edge } from '../modules/edge';
import type { Node } from '../modules/nodes';

export type Recordable<T = any> = Record<string, T>;

export type Graph = {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
};

export type LucideIconProps =
  | Component<IconProps>
  | ComponentType<SvelteComponent<IconProps>>;
