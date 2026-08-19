import { getContext, setContext } from 'svelte';

import type { SortableContextValue } from './Sortable.types';

const SORTABLE_KEY = Symbol('SORTABLE');

export const setSortableContext = (value: SortableContextValue) => {
  return setContext(SORTABLE_KEY, value);
};

export const getSortableContext = () => {
  return getContext<SortableContextValue>(SORTABLE_KEY);
};
