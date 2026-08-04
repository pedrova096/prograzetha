import type { HTMLProps } from 'node_modules/svelte/svelte-html';
import type { Snippet } from 'svelte';
import type { ClassValue, HTMLAttributes } from 'svelte/elements';

import type { Recordable } from '~/lib/types';

export type RadioGroupClassNames = {
  container?: ClassValue;
  label?: ClassValue;
  radioContainer?: ClassValue;
  radioWrapper?: ClassValue;
  radio?: ClassValue;
  radioLabel?: ClassValue;
};

export type RadioGroupVariant = 'default' | 'outline' | 'secondary';
export type RadioGroupSize = 'sm' | 'md' | 'lg';

export type RadioGroupChangeEvent<
  T extends Recordable = Recordable,
  K extends keyof T = string,
> = CustomEvent<{
  value: T[K];
}>;

export type RadioGroupProps<
  T extends Recordable = Recordable,
  K extends keyof T = string,
> = Omit<
  HTMLProps<'input', HTMLAttributes<any>>,
  'value' | 'type' | 'size' | 'onchange'
> & {
  classNames?: RadioGroupClassNames;
  ref?: globalThis.HTMLInputElement | null;
  label?: string;
  helper?: string | string[] | null;
  error?: boolean;
  value?: string;
  helperHint?: Snippet<[]>;
  options?: T[];
  optionRender?: Snippet<[T, boolean]>;
  optionLabel?: keyof T;
  optionValue?: K;
  name?: string;
  onchange?: (event: RadioGroupChangeEvent<T, K>) => void;
  variant?: RadioGroupVariant;
  size?: RadioGroupSize;
};
