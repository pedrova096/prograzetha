import type { SortableOptions } from 'sortablejs';

export const SORTABLE_OPTIONS: SortableOptions = {
  animation: 150,
  fallbackOnBody: true,
  group: 'conditions',
  dataIdAttr: 'data-condition-id',
  swapThreshold: 0.65,
};
