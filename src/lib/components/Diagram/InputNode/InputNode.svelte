<script lang="ts">
  import { LITERAL_VARIANT_MAP } from '~/lib/constants';
  import type { InputNodeData } from '~/lib/modules/nodes';
  import type { NodeProps } from '../Node';
  import { Node } from '../Node';

  let props: NodeProps = $props();
  let data = $derived(props.node.data as InputNodeData);

  const Icon = $derived(LITERAL_VARIANT_MAP[data.type].icon);
</script>

<Node {...props}>
  {#if data.name}
    <div
      class="bg-zinc-100 border border-zinc-300 rounded-sm w-[80%] text-xs py-0.5 px-1.5 text-zinc-800 font-semibold flex items-center gap-1"
    >
      <Icon class="size-3 inline-flex" />
      <span class="truncate">
        {data.name}
      </span>
    </div>
  {/if}
</Node>
