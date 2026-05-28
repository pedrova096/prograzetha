import { getContext, setContext } from "svelte";

import type { SortableClassNames } from "./Sortable.types";

export type SortableContextValue = {
  classNames: SortableClassNames;
};

const SORTABLE_KEY = Symbol("SORTABLE");

export const setSortableContext = (value: SortableContextValue) => {
  return setContext(SORTABLE_KEY, value);
};

export const getSortableContext = () => {
  return getContext<SortableContextValue>(SORTABLE_KEY);
};
