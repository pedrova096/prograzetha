<script lang="ts">
  import { tooltip } from '~/lib/attachments';

  import { ICON_BY_TYPE, TITLE_BY_TYPE } from './Node.constants';
  import type { NodeProps } from './Node.types';

  let { node, class: className, ...props }: NodeProps = $props();
  let { id, type } = $derived(node);

  let title = $derived(TITLE_BY_TYPE[type]);
  let Icon = $derived(ICON_BY_TYPE[type]);
</script>

<div
  {id}
  {@attach tooltip({ content: id, interactive: false })}
  {...props}
  class={[
    'flex items-center justify-center rounded-lg border-2 border-zinc-300 bg-white px-4 py-2 shadow-md transition-shadow hover:shadow-lg z-10 w-40 cursor-pointer',
    className,
  ]}
>
  <Icon class="inline-flex mr-1 opacity-40 size-3 stroke-3 absolute left-4" />
  <span class="text-sm font-medium text-zinc-700 select-none">{title}</span>
</div>
