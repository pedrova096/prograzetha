import { getContext, setContext } from 'svelte';
import type { SidebarContextValue } from './Sidebar.types';

const CONTEXT_KEY = Symbol('sidebar');

export function setSidebarContext(context: SidebarContextValue) {
  setContext(CONTEXT_KEY, context);
}

export function getSidebarContext() {
  const context = getContext<SidebarContextValue>(CONTEXT_KEY);

  if (!context) {
    throw new Error(
      'Sidebar sub-components must be used inside <Sidebar.Root>',
    );
  }

  return context;
}
