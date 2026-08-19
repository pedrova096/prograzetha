<script lang="ts">
  import type { OutputNodeData } from '~/lib/modules/nodes';
  import type { NodeProps } from '../Node';
  import { Node } from '../Node';

  let props: NodeProps = $props();
  let data = $derived(props.node.data as OutputNodeData);
</script>

<Node {...props}>
  {#if data.text}
    <div
      class="bg-zinc-100 border border-zinc-300 rounded-sm w-[80%] text-xs py-0.5 px-1.5 text-zinc-800 font-semibold flex items-center gap-1"
    >
      <span class="truncate">
        {data.text}
      </span>
    </div>
  {/if}
</Node>
