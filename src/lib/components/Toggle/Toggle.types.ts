import type { HTMLInputAttributes } from 'svelte/elements';

export type ToggleProps = Omit<HTMLInputAttributes, 'type' | 'checked'> & {
  checked?: boolean;
  label?: string;
};
