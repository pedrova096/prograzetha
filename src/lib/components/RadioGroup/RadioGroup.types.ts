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

export type RadioGroupProps<T extends Recordable = Recordable> = Omit<
  HTMLProps<'input', HTMLAttributes<any>>,
  'value' | 'type' | 'size'
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
  optionValue?: keyof T;
  name?: string;
  variant?: RadioGroupVariant;
  size?: RadioGroupSize;
};
