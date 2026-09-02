<script lang="ts">
  import { Maximize, ZoomIn, ZoomOut } from '@lucide/svelte';
  import { getGraphContext, getRuntimeContext } from '~/App.context.svelte';
  import { getLayout } from '~/lib/modules/layout';
  import type { RenderEdge, RenderNode } from '~/lib/modules/layout';
  import { EdgeInsertionTargetType } from '~/lib/modules/edge';
  import { AddButton, type AddButtonProps } from '../AddButton';
  import { Node, type NodeProps } from './Node';
  import { edgeMidpoint, roundedEdgePath } from './Diagram.utils';
  import { NodeTypes } from '~/lib/modules/nodes';
  import { generatePath } from '~/utils';
  import { navigateTo } from '~/utils/navigation';
  import { DockRoutes } from '../Dock/Dock.constants';
  import { NODE_COMPONENTS } from './Diagram.constants';
  import { DiagramViewportController } from './Diagram.viewport.svelte';

  const graph = getGraphContext();
  let { nodes, edges, start } = $derived(graph);

  let { runtimeState } = $derived(getRuntimeContext());

  let hoveredEdgeId = $state<string | null>(null);
  let addMenuOpen = $state(false);
  let layout = $derived(getLayout({ nodes, edges }, start));
  const viewport = new DiagramViewportController(() => layout.box);
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

  const edgeLabelStyle = (edge: RenderEdge) => {
    const point = edge.labelPoint ?? edgeMidpoint(edge.points);

    return [
      `left: ${point.x - layout.box.x}px`,
      `top: ${point.y - layout.box.y}px`,
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

    const newNode = graph.attachNewNode(
      insertTarget,
      option.value as NodeTypes,
    );

    if (!newNode) return;

    navigateTo(
      generatePath(DockRoutes.NodeTypeId, {
        id: newNode.id,
        type: newNode.type,
      }),
    );
  };

  const onNodeClickHandler = (node: NodeProps['node']) => {
    if (node.type === NodeTypes.Start || node.type === NodeTypes.End) return;

    navigateTo(
      generatePath(DockRoutes.NodeTypeId, {
        id: node.id,
        type: node.type,
      }),
    );
  };

  const onNodeDeleteHandler = (node: NodeProps['node']) => {
    if (!graph.deleteNode(node.id)) return;
    // Check if that id its open
    navigateTo(DockRoutes.Home);
  };

  const runtime = $derived(
    runtimeState.kind === 'ready' ? runtimeState.runtime : null,
  );

  const edgePaths = $derived(
    layout.edges.map((edge) => ({
      id: edge.id,
      node: edge.source,
      isJoin: edge.isJoin,
      isDecorative: edge.isDecorative,
      isTraverse:
        !edge.isDecorative && runtime?.traverseNodeIds.has(edge.source),
      path: roundedEdgePath(edge.points),
    })),
  );
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  {@attach viewport.attach}
  class={[
    'relative size-full min-h-0 overflow-hidden rounded-sm outline-none touch-none',
    viewport.isPanning ? 'cursor-grabbing' : 'cursor-grab',
  ]}
  role="application"
  aria-label="Diagrama interactivo"
  aria-describedby="diagram-navigation-help"
  tabindex="0"
  onpointerleave={clearHoveredEdge}
>
  <span id="diagram-navigation-help" class="sr-only">
    Arrastra el fondo para mover el diagrama. Usa la rueda del ratón para
    acercar o alejar. Pulsa más, menos o cero para controlar la vista con el
    teclado.
  </span>

  <div
    class="absolute left-0 top-0"
    style:width={`${layout.box.width}px`}
    style:height={`${layout.box.height}px`}
    style:transform={viewport.transform}
    style:transform-origin="0 0"
  >
  <svg
    class="pointer-events-none absolute inset-0 overflow-visible text-zinc-600"
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
        aria-hidden={edge.isDecorative ? 'true' : undefined}
        onpointerenter={() => {
          if (!edge.isDecorative) hoveredEdgeId = edge.id;
        }}
      >
        {#if !edge.isDecorative}
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
        {/if}
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
            !edge.isDecorative &&
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

  {#each layout.edges as edge (edge.id)}
    {#if edge.label}
      <span
        class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-xs bg-zinc-600 px-1 py-px text-[10px] font-semibold text-zinc-200 shadow-sm"
        style={edgeLabelStyle(edge)}
      >
        {edge.label}
      </span>
    {/if}
  {/each}

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
      {@const Component = NODE_COMPONENTS[node.type] ?? Node}
      <Component
        {node}
        onDelete={onNodeDeleteHandler}
        data-diagram-interactive
        class="absolute"
        style={nodeStyle(renderNode)}
        onclick={() => onNodeClickHandler(node)}
      />
    {/if}
  {/each}
  </div>

  <div
    class="absolute bottom-3 left-3 z-30 flex items-center rounded-md border border-zinc-200 bg-white p-1 shadow-sm"
    data-diagram-interactive
  >
    <button
      type="button"
      aria-label="Alejar"
      title="Alejar (-)"
      disabled={!viewport.canZoomOut}
      class="rounded p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
      onclick={viewport.zoomOut}
    >
      <ZoomOut class="size-4" />
    </button>
    <output
      aria-label="Nivel de zoom"
      class="w-12 select-none text-center text-xs font-medium tabular-nums text-zinc-600"
    >
      {viewport.zoomPercentage}%
    </output>
    <button
      type="button"
      aria-label="Acercar"
      title="Acercar (+)"
      disabled={!viewport.canZoomIn}
      class="rounded p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
      onclick={viewport.zoomIn}
    >
      <ZoomIn class="size-4" />
    </button>
    <div class="mx-1 h-5 w-px bg-zinc-200"></div>
    <button
      type="button"
      aria-label="Ajustar diagrama a la vista"
      title="Ajustar a la vista (0)"
      class="rounded p-1.5 text-zinc-600 hover:bg-zinc-100"
      onclick={viewport.fitView}
    >
      <Maximize class="size-4" />
    </button>
  </div>
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
