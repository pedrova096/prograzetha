<script lang="ts">
  import { GripVertical } from '@lucide/svelte';

  import { Sortable, SortItem, SortHandle } from './index';
  import type {
    SortValue,
    SortableClassNames,
    SortableProps,
  } from './Sortable.types';
  import Self from './Sortable.example.svelte';
  import type { SortableOptions } from 'sortablejs';

  type Props = {
    id?: string;
    data: SortValue;
  };

  let { id = 'root', data }: Props = $props();

  const onEndHandler: SortableProps['onEnd'] = (event, sortable) => {
    console.log(
      {
        id,
        item: event.item.dataset.item,
        oldIndex: event.oldIndex, // element's old index within old parent
        newIndex: event.newIndex, // element's new index within new parent
        oldDraggableIndex: event.oldDraggableIndex, // element's old index within old parent, only counting draggable elements
        newDraggableIndex: event.newDraggableIndex,
        event,
      },
      sortable.toArray(),
    );
  };

  const SORTABLE_OPTIONS: SortableOptions = {
    fallbackOnBody: true,
    swapThreshold: 0.65,
    group: 'nested',
    dataIdAttr: 'data-item',
  };
  const SORTABLE_CLASSNAMES: SortableClassNames = {
    item: 'item',
  };
</script>

<Sortable
  class="flex flex-col gap-2 p-4 border border-zinc-200 rounded-md"
  classNames={SORTABLE_CLASSNAMES}
  onEnd={onEndHandler}
  onStart={onEndHandler}
  options={SORTABLE_OPTIONS}
>
  {#each data as item}
    {#if Array.isArray(item)}
      <SortItem class="item" data-item={item}>
        <Self id={JSON.stringify(item)} data={item} />
      </SortItem>
    {:else}
      <SortItem
        class="item w-96 h-24 bg-emerald-100 rounded-md border border-emerald-800 flex items-center gap-2 px-4"
        data-item={item}
      >
        <SortHandle>
          <GripVertical class="w-5 h-5" />
        </SortHandle>
        {item}
      </SortItem>
    {/if}
  {/each}
</Sortable>
