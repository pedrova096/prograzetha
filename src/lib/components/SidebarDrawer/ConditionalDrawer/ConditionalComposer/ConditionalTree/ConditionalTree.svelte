<script lang="ts">
  import {
    Sortable,
    SortHandle,
    SortItem,
    type SortableProps,
  } from '~/lib/components/Sortable';

  import { SORTABLE_OPTIONS } from './ConditionalTree.constants';
  import Self from './ConditionalTree.svelte';
  import type { ConditionalTreeProps } from './ConditionalTree.types';
  import { isConditionNode, type ConditionUnion } from '~/lib/modules/nodes';
  import { FolderPlus, Plus } from 'lucide-svelte';
  import {
    createCondition,
    createConditionGroup,
  } from './ConditionalTree.utils';
  import { getConditionalComposer } from '../ConditionalComposer.context';

  import { ConditionNode, type ConditionNodeProps } from './ConditionNode';

  let { path = '', value }: ConditionalTreeProps = $props();
  const { addConditionChild, moveCondition, removeCondition, updateCondition } =
    getConditionalComposer();

  const onEndHandler: SortableProps['onEnd'] = (event) => {
    const oldIndex = event.oldDraggableIndex ?? event.oldIndex;
    const newIndex = event.newDraggableIndex ?? event.newIndex;

    if (oldIndex === undefined || newIndex === undefined) return;
    if (oldIndex === newIndex && event.from === event.to) return;

    moveCondition({
      fromPath: event.from.dataset.path!,
      toPath: event.to.dataset.path!,
      newIndex,
      oldIndex,
    });
  };

  const addConditionChildHandler = (child: ConditionUnion) => {
    addConditionChild(path, child);
  };

  const onConditionNodChangeHandler: ConditionNodeProps['onchange'] = (
    event,
  ) => {
    updateCondition(event.detail.name, event.detail.value);
  };

  const pathPrefix = $derived(path ? `${path}.` : '');
  const sortKey = $derived.by(() => {
    if (isConditionNode(value)) return '';
    return value.children.map((child) => child.id).join(',');
  });
</script>

{#if isConditionNode(value)}
  <ConditionNode name={path} {value} onchange={onConditionNodChangeHandler} />
{:else}
  {#key sortKey}
    <Sortable
      class={[
        'flex flex-col gap-1',
        'rounded-md border border-dashed border-zinc-300 bg-white/70 p-2',
      ]}
      options={SORTABLE_OPTIONS}
      onEnd={onEndHandler}
      data-path={path}
    >
      {#each value.children as item, index (item.id)}
        {@const itemPath = `${pathPrefix}children.${index}`}
        <SortItem data-condition-id={item.id}>
          <Self
            path={itemPath}
            value={value.children[index]}
            onremove={() => removeCondition(itemPath)}
          />
        </SortItem>
      {/each}
    </Sortable>
  {/key}

  <div class="mt-1 flex items-center gap-2 border-t border-zinc-200 pt-2">
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
      onclick={() => addConditionChildHandler(createCondition())}
    >
      <Plus class="size-3.5" />
      Condición
    </button>

    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
      onclick={() => addConditionChildHandler(createConditionGroup())}
    >
      <FolderPlus class="size-3.5" />
      Grupo
    </button>
  </div>
{/if}
