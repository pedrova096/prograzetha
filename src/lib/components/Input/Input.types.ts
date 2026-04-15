import type { HTMLInputAttributes } from 'svelte/elements';

export interface InputProps extends Omit<HTMLInputAttributes, 'class'> {
  value?: string;
  placeholder?: string;
  class?: string;
  clearable?: boolean;
  onClear?: () => void;
}
