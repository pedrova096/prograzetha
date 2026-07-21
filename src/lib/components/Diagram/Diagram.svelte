<script lang="ts">
  import {
    attachNewNode,
    getDiagramContext,
    getRuntimeContext,
  } from '~/App.context.svelte';
  import { getLayout } from '~/lib/modules/layout';
  import type { RenderEdge, RenderNode } from '~/lib/modules/layout';
  import { EdgeInsertionTargetType } from '~/lib/modules/edge';
  import { AddButton, type AddButtonProps } from '../AddButton';
  import { Node, type NodeProps } from './Node';
  import { edgeMidpoint, roundedEdgePath } from './Diagram.utils';
  import { NodeTypes } from '~/lib/modules/nodes';
  import { navigate } from 'svelte-routing';
  import { generatePath } from '~/utils';
  import { DrawerRoutes } from '../SidebarDrawer';

  let {
    diagram: { nodes, edges, start },
  } = $derived(getDiagramContext());

  let { runtimeState } = $derived(getRuntimeContext());

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

  const onNewNodeSelected: AddButtonProps['onSelected'] = (_, option) => {
    const layoutEdge = hoveredEdgeId
      ? layoutEdgesById.get(hoveredEdgeId)
      : undefined;

    if (!layoutEdge) {
      console.error('Not edge found');
      return;
    }

    const insertTarget = layoutEdge.insertTarget ?? {
      type: EdgeInsertionTargetType.Edge,
      source: layoutEdge.source,
    };

    const newNode = attachNewNode(insertTarget, option.value as NodeTypes);

    if (!newNode) return;

    navigate(
      generatePath(DrawerRoutes.NodeTypeId, {
        id: newNode.id,
        type: newNode.type,
      }),
    );
  };

  const onNodeClickHandler = (node: NodeProps['node']) => {
    if (node.type === NodeTypes.Start || node.type === NodeTypes.End) return;

    navigate(
      generatePath(DrawerRoutes.NodeTypeId, {
        id: node.id,
        type: node.type,
      }),
    );
  };

  const runtime = $derived(
    runtimeState.kind === 'ready' ? runtimeState.runtime : null,
  );

  const edgePaths = $derived(
    layout.edges.map((edge) => ({
      id: edge.id,
      node: edge.source,
      isJoin: edge.isJoin,
      isTraverse: runtime?.traverseNodeIds.has(edge.source),
      path: roundedEdgePath(edge.points),
    })),
  );
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
    class="pointer-events-none absolute inset-0 overflow-visible stroke-zinc-400"
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
          stroke="context-stroke"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </marker>
    </defs>

    {#each edgePaths as edge (edge.id)}
      <g
        role="group"
        aria-label={`Connection ${edge.id}`}
        onpointerenter={() => (hoveredEdgeId = edge.id)}
      >
        <path
          aria-hidden="true"
          d={edge.path}
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
          d={edge.path}
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          marker-end={edge.isJoin ? undefined : 'url(#edge-arrow)'}
          class={[
            'transition-[filter,stroke-width] duration-150',
            hoveredEdgeId === edge.id &&
              'z-10 stroke-sky-500 drop-shadow-[0_3px_5px_rgba(37,99,235,0.45)]',
          ]}
        />
        {#if edge.isTraverse}
          <path
            aria-hidden="true"
            d={edge.path}
            pathLength="1"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            marker-end={edge.isJoin ? undefined : 'url(#edge-arrow)'}
            style:--progress-edge-duration={`${runtime?.speed.edgeMs}ms`}
            class="progress-edge-path stroke-emerald-500 drop-shadow-[0_3px_5px_rgba(16,185,129,0.35)]"
          />
        {/if}
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
      onSelected={onNewNodeSelected}
    />
  {/if}

  {#each layout.nodes as renderNode (renderNode.id)}
    {@const node = nodes.get(renderNode.id)}

    {#if node}
      <Node
        {node}
        class="absolute"
        style={nodeStyle(renderNode)}
        onclick={() => onNodeClickHandler(node)}
      />
    {/if}
  {/each}
</div>

<style>
  .progress-edge-path {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: draw-progress-edge var(--progress-edge-duration, 450ms) ease-out
      forwards;
  }

  @keyframes draw-progress-edge {
    to {
      stroke-dashoffset: 0;
    }
  }
</style>
