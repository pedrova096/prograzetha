<script lang="ts">
  import { getDiagramContext } from '~/App.context.svelte';
  import { getLayout } from '~/lib/modules/layout';
  import type { RenderNode } from '~/lib/modules/layout';
  import { Node } from '../Node';
  import { roundedEdgePath } from './Diagram.utils';

  let {
    diagram: { nodes, edges, start },
  } = $derived(getDiagramContext());

  let layout = $derived(getLayout({ nodes, edges }, start));

  const nodeStyle = (node: RenderNode) => {
    return [
      `left: ${node.x - layout.box.x}px`,
      `top: ${node.y - layout.box.y}px`,
      `width: ${node.width}px`,
      `height: ${node.height}px`,
    ].join('; ');
  };
</script>

<div
  class="relative"
  style:width={`${layout.box.width}px`}
  style:height={`${layout.box.height}px`}
>
  <svg
    class="pointer-events-none absolute inset-0 overflow-visible text-blue-500"
    width={layout.box.width}
    height={layout.box.height}
    viewBox={`0 0 ${layout.box.width} ${layout.box.height}`}
  >
    <defs>
      <marker
        id="edge-arrow"
        markerWidth="10"
        markerHeight="10"
        refX="6"
        refY="5"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path
          d="M 2 2 L 6 5 2 8"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </marker>
    </defs>

    {#each layout.edges as edge (edge.id)}
      <path
        d={roundedEdgePath(edge.points)}
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        marker-end={edge.isJoin ? undefined : 'url(#edge-arrow)'}
      />
    {/each}
  </svg>

  {#each layout.nodes as renderNode (renderNode.id)}
    {@const node = nodes.get(renderNode.id)}

    {#if node}
      <Node {node} class="absolute" style={nodeStyle(renderNode)} />
    {/if}
  {/each}
</div>
