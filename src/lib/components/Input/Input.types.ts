import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';

export interface InputProps extends Omit<HTMLInputAttributes, 'class'> {
  ref?: HTMLInputElement | null;
  value?: string;
  class?: string;
  label?: string;
  helper?: string | string[] | null;
  helperHint?: Snippet;
  startAdornment?: Snippet;
  error?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}
