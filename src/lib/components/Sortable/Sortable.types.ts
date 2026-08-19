import type Sortable from 'sortablejs';
import type { SortableEvent, Options as SortableOptions } from 'sortablejs';
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type SortableClassNames = {
  chosen?: string;
  drag?: string;
  filter?: string;
  ghost?: string;
  handle?: string;
  item?: string;
};

export type SortableHandler = (
  event: SortableEvent,
  sortable: Sortable,
) => void;

export type SortableProps = HTMLAttributes<HTMLUListElement> & {
  children?: Snippet;
  classNames?: SortableClassNames;
  group?: string;
  onAdd?: SortableHandler;
  onStart?: SortableHandler;
  onChange?: SortableHandler;
  onEnd?: SortableHandler;
  onRemove?: SortableHandler;
  onSort?: SortableHandler;
  options?: SortableOptions;
};

type Item = string | Item[];
export type SortValue = Item[];

export type GetSortableOptions = Omit<
  SortableOptions,
  | 'handle'
  | 'ghostClass'
  | 'chosenClass'
  | 'dragClass'
  | 'onSort'
  | 'onAdd'
  | 'onRemove'
  | 'onChange'
  | 'onEnd'
  | 'onStart'
> & {
  classNames?: SortableClassNames;
  onAdd?: SortableHandler;
  onEnd?: SortableHandler;
  onChange?: SortableHandler;
  onRemove?: SortableHandler;
  onSort?: SortableHandler;
  onStart?: SortableHandler;
};

export type SortableContextValue = {
  classNames: SortableClassNames;
};
