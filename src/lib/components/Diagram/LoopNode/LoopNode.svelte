<script lang="ts">
  import { ForLoopNode } from '~/lib/modules/nodes';
  import type { NodeProps } from '../Node';
  import { Node } from '../Node';

  let props: NodeProps = $props();
  let summary = $derived.by(() => {
    const node = props.node;

    return ForLoopNode.nodeIs(node)
      ? `${node.data.iterator}: ${node.data.start} → ${node.data.end} (${node.data.step})`
      : 'Mientras';
  });
</script>

<Node {...props}>
  <div
    class="flex w-[80%] items-center rounded-sm border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 text-xs font-semibold text-zinc-800"
  >
    {summary}
  </div>
</Node>
