<script lang="ts">
  import { tooltip } from '~/lib/attachments';

  import { NodeStates } from '~/lib/modules/nodes';
  import { ICON_BY_TYPE, TITLE_BY_TYPE } from './Node.constants';
  import type { NodeProps } from './Node.types';

  let { node, class: className, ...props }: NodeProps = $props();
  let { id, type, state } = $derived(node);

  let title = $derived(TITLE_BY_TYPE[type]);
  let Icon = $derived(ICON_BY_TYPE[type]);
  let isMarked = $derived(
    state === NodeStates.New || state === NodeStates.Error,
  );
</script>

<div
  {id}
  {@attach tooltip({ content: id, interactive: false })}
  {...props}
  class={[
    'flex items-center justify-center rounded-lg border-2 bg-white px-4 py-2 shadow-md transition-shadow hover:shadow-lg z-10 w-40 cursor-pointer border-zinc-300',
    state === NodeStates.New && 'border-dashed',
    state === NodeStates.Error && 'border-red-500',
    className,
  ]}
>
  {#if isMarked}
    <span
      aria-hidden="true"
      class={[
        'absolute -left-1.5 top-1/2 size-2.5 -translate-y-1/2 rounded-full',
        state === NodeStates.New && 'bg-sky-500',
        state === NodeStates.Error && 'bg-red-500',
      ]}
    ></span>
  {/if}

  <Icon class="inline-flex mr-1 opacity-40 size-3 stroke-3 absolute left-4" />
  <span class="text-sm font-medium text-zinc-700 select-none">{title}</span>
</div>
