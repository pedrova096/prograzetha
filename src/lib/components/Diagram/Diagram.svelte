<script lang="ts">
  import { getDiagramContext } from '~/App.context.svelte';
  import { getLayout } from '~/lib/modules/layout';
  import type { RenderEdge, RenderNode } from '~/lib/modules/layout';
  import { AddButton, type AddButtonProps } from '../AddButton';
  import { Node } from './Node';
  import { edgeMidpoint, roundedEdgePath } from './Diagram.utils';

  let {
    diagram: { nodes, edges, start },
  } = $derived(getDiagramContext());

  let hoveredEdgeId = $state<string | null>(null);
  let addMenuOpen = $state(false);
  let layout = $derived(getLayout({ nodes, edges }, start));
  let layoutEdgesById = $derived(
    new Map(layout.edges.map((edge) => [edge.id, edge])),
  );
  let hoveredEdge = $derived(
    hoveredEdgeId ? layoutEdgesById.get(hoveredEdgeId) : null,
  );

  const nodeStyle = (node: RenderNode) => {
    return [
      `left: ${node.x - layout.box.x}px`,
      `top: ${node.y - layout.box.y}px`,
      `width: ${node.width}px`,
      `height: ${node.height}px`,
    ].join('; ');
  };

  const edgeButtonStyle = (edge: RenderEdge) => {
    const midpoint = edgeMidpoint(edge.points);

    return [
      `left: ${midpoint.x - layout.box.x}px`,
      `top: ${midpoint.y - layout.box.y - 2}px`,
    ].join('; ');
  };

  const clearHoveredEdge = () => {
    if (addMenuOpen) return;

    hoveredEdgeId = null;
  };

  const onSelectHandler: AddButtonProps['onSelect'] = (_, option) => {
    console.log('hover', hoveredEdgeId, layoutEdgesById.get(hoveredEdgeId));
    console.log('node', nodes.get(layoutEdgesById.get(hoveredEdgeId).source));
  };
</script>

<div
  class="relative"
  role="region"
  aria-label="Diagram"
  style:width={`${layout.box.width}px`}
  style:height={`${layout.box.height}px`}
  onpointerleave={clearHoveredEdge}
>
  <svg
    class="pointer-events-none absolute inset-0 overflow-visible text-zinc-400"
    role="img"
    aria-label="Diagram connections"
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
      <g
        role="group"
        aria-label={`Connection ${edge.id}`}
        onpointerenter={() => (hoveredEdgeId = edge.id)}
      >
        <path
          aria-hidden="true"
          d={roundedEdgePath(edge.points)}
          fill="none"
          stroke="transparent"
          stroke-width="16"
          stroke-linecap="round"
          stroke-linejoin="round"
          pointer-events="stroke"
          class="cursor-pointer"
        />
        <path
          role="presentation"
          d={roundedEdgePath(edge.points)}
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          marker-end={edge.isJoin ? undefined : 'url(#edge-arrow)'}
          class={[
            'transition-[filter,stroke-width] duration-150',
            hoveredEdgeId === edge.id &&
              'text-sky-500 z-10 drop-shadow-[0_3px_5px_rgba(37,99,235,0.45)]',
          ]}
        />
      </g>
    {/each}
  </svg>

  {#if hoveredEdge}
    <AddButton
      bind:open={addMenuOpen}
      class="absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={edgeButtonStyle(hoveredEdge)}
      triggerLabel={`Add node on connection ${hoveredEdge.id}`}
      onpointerenter={() => (hoveredEdgeId = hoveredEdge.id)}
      onSelect={onSelectHandler}
    />
  {/if}

  {#each layout.nodes as renderNode (renderNode.id)}
    {@const node = nodes.get(renderNode.id)}

    {#if node}
      <Node {node} class="absolute" style={nodeStyle(renderNode)} />
    {/if}
  {/each}
</div>
