import { getContext, setContext } from 'svelte';
import type { DropdownContextValue } from './Dropdown.types';

const CONTEXT_KEY = Symbol('dropdown');

export function setDropdownContext(ctx: DropdownContextValue) {
  setContext(CONTEXT_KEY, ctx);
}

export function getDropdownContext<T>(): DropdownContextValue<T> {
  const ctx = getContext<DropdownContextValue<T>>(CONTEXT_KEY);
  if (!ctx)
    throw new Error(
      'Dropdown sub-components must be used inside <Dropdown.Root>',
    );
  return ctx;
}
