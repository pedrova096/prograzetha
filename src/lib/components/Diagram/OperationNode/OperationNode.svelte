<script lang="ts">
  import { LITERAL_VARIANT_MAP } from '~/lib/constants';
  import type { OperationNodeData } from '~/lib/modules/nodes';
  import type { NodeProps } from '../Node';
  import { Node } from '../Node';

  let props: NodeProps = $props();
  let data = $derived(props.node.data as OperationNodeData);

  const Icon = $derived(LITERAL_VARIANT_MAP[data.leftMeta.type].icon);

  let leftSide = $derived(
    data.leftSide.length <= 3 ? data.leftSide : `${data.leftSide[0]}..`,
  );
</script>

<Node {...props}>
  {#if data.leftSide}
    <div
      class="bg-zinc-100 border border-zinc-300 rounded-sm w-[80%] text-xs py-0.5 px-1.5 text-zinc-800 font-semibold flex items-center gap-1"
    >
      <span class="truncate">
        <Icon class="size-3 inline-flex" />
        {leftSide} = {data.rightSide}
      </span>
    </div>
  {/if}
</Node>
