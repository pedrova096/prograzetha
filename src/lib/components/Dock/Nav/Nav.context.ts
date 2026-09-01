import { getContext, setContext } from 'svelte';
import type { NavContextValue } from './Nav.types';

const CONTEXT_KEY = Symbol('Nav');

export function setNavContext(context: NavContextValue) {
  setContext(CONTEXT_KEY, context);
}

export function getNavContext() {
  const context = getContext<NavContextValue>(CONTEXT_KEY);

  if (!context) {
    throw new Error('Nav sub-components must be used inside <Nav.Root>');
  }

  return context;
}
