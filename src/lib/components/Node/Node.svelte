<script lang="ts">
  import { tooltip } from '~/lib/attachments';
  import type { NodeProps } from './Node.types';

  let { node, class: className, ...props }: NodeProps = $props();
  let { id, type } = $derived(node);
</script>

<div
  {id}
  {@attach tooltip({ content: id, interactive: false })}
  {...props}
  class={[
    'flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-4 py-2 shadow-md transition-shadow hover:shadow-lg z-10 w-40',
    className,
  ]}
>
  <span class="text-sm font-medium text-gray-700">{type}</span>
</div>
