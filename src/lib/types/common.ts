import type { IconProps } from 'lucide-svelte';
import type { Component, ComponentType, SvelteComponent } from 'svelte';

export type Recordable<T = any> = Record<string, T>;

export type LucideIconProps =
  | typeof import('lucide-svelte').Plus
  | Component<IconProps>
  | ComponentType<SvelteComponent<IconProps>>;
