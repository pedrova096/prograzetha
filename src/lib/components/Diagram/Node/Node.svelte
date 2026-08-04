<script lang="ts">
  import { tooltip } from '~/lib/attachments';
  import { Trash2 } from 'lucide-svelte';

  import { NodeStates, NodeTypes } from '~/lib/modules/nodes';
  import { ICON_BY_TYPE, TITLE_BY_TYPE } from './Node.constants';
  import type { NodeProps } from './Node.types';

  let { node, onDelete, class: className, ...props }: NodeProps = $props();
  let { id, type, state } = $derived(node);

  let title = $derived(TITLE_BY_TYPE[type]);
  let Icon = $derived(ICON_BY_TYPE[type]);
  let isMarked = $derived(
    state === NodeStates.New || state === NodeStates.Error,
  );
  let canRemove = $derived(type !== NodeTypes.Start && type !== NodeTypes.End);
</script>

<div
  {id}
  {@attach tooltip({ content: id, interactive: false })}
  {...props}
  class={[
    'group flex items-center justify-center rounded-lg border-2 bg-white px-4 py-2 shadow-md transition-shadow hover:shadow-lg z-10 w-40 cursor-pointer',
    state === NodeStates.New && 'border-dashed',
    state === NodeStates.Error && 'border-rose-300 shadow-rose-100',
    state !== NodeStates.Error && 'border-zinc-300',
    className,
  ]}
>
  {#if isMarked}
    <span
      aria-hidden="true"
      class={[
        'absolute -left-1.5 top-1/2 size-2.5 -translate-y-1/2 rounded-full',
        state === NodeStates.New && 'bg-sky-500',
        state === NodeStates.Error && 'bg-rose-400',
      ]}
    ></span>
  {/if}

  <Icon class="inline-flex mr-1 opacity-40 size-3 stroke-3 absolute left-4" />
  <span class="text-sm font-medium text-zinc-700 select-none">{title}</span>

  {#if canRemove}
    <button
      type="button"
      aria-label={`Eliminar ${title}`}
      title="Eliminar nodo"
      class="absolute right-2 rounded p-1 text-zinc-400 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 focus:opacity-100 group-hover:opacity-100"
      onclick={(event) => {
        event.stopPropagation();
        onDelete?.(node);
      }}
    >
      <Trash2 class="size-3.5" />
    </button>
  {/if}
</div>
