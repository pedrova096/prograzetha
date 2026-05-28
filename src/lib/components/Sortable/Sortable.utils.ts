import Sortable, { type SortableEvent } from 'sortablejs';
import type { Attachment } from 'svelte/attachments';

import { DEFAULT_CLASSNAMES } from './Sortable.constants';
import type { GetSortableOptions, SortableHandler } from './Sortable.types';

export const getSortable =
  (options: GetSortableOptions): Attachment<HTMLUListElement> =>
  (element) => {
    const {
      animation = 150,
      classNames = DEFAULT_CLASSNAMES,
      onAdd,
      onChange,
      onEnd,
      onStart,
      onRemove,
      onSort,
      ...restOptions
    } = options;

    const emit = (
      eventName: string,
      event: SortableEvent,
      instance: Sortable,
    ) => {
      const handlers: Record<string, SortableHandler | undefined> = {
        add: onAdd,
        change: onChange,
        end: onEnd,
        remove: onRemove,
        sort: onSort,
        start: onStart,
      };

      const handler = handlers[eventName];
      handler?.(event, instance);
    };

    const instance = Sortable.create(element, {
      animation,
      ghostClass: classNames.ghost,
      chosenClass: classNames.chosen,
      dragClass: classNames.drag,
      handle: `.${classNames.handle}`,
      draggable: `.${classNames.item}`,
      filter: `.${classNames.filter}`,
      onStart: (event) => emit('start', event, instance),
      onEnd: (event) => emit('end', event, instance),
      onAdd: (event) => emit('add', event, instance),
      onRemove: (event) => emit('remove', event, instance),
      onChange: (event) => emit('change', event, instance),
      onSort: (event) => emit('sort', event, instance),
      ...restOptions,
    });

    return () => {
      instance.destroy();
    };
  };
