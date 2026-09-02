<script lang="ts">
  import { onMount } from 'svelte';
  import { Maximize, ZoomIn, ZoomOut } from '@lucide/svelte';
  import { getGraphContext, getRuntimeContext } from '~/App.context.svelte';
  import { getLayout } from '~/lib/modules/layout';
  import type { RenderEdge, RenderNode } from '~/lib/modules/layout';
  import { EdgeInsertionTargetType } from '~/lib/modules/edge';
  import { AddButton, type AddButtonProps } from '../AddButton';
  import { Node, type NodeProps } from './Node';
  import {
    clamp,
    edgeMidpoint,
    fitDiagramToViewport,
    roundedEdgePath,
    zoomAroundPoint,
  } from './Diagram.utils';
  import { NodeTypes } from '~/lib/modules/nodes';
  import { generatePath } from '~/utils';
  import { navigateTo } from '~/utils/navigation';
  import { DockRoutes } from '../Dock';
  import {
    DIAGRAM_VIEW_PADDING,
    DIAGRAM_ZOOM_STEP,
    MAX_DIAGRAM_ZOOM,
    MIN_DIAGRAM_ZOOM,
    NODE_COMPONENTS,
  } from './Diagram.constants';

  const graph = getGraphContext();
  let { nodes, edges, start } = $derived(graph);

  let { runtimeState } = $derived(getRuntimeContext());

  let hoveredEdgeId = $state<string | null>(null);
  let addMenuOpen = $state(false);
  let viewportElement = $state<HTMLDivElement>();
  let pan = $state({ x: 0, y: 0 });
  let zoom = $state(1);
  let isPanning = $state(false);
  let activePointerId: number | null = null;
  let pointerOrigin = { x: 0, y: 0 };
  let panOrigin = { x: 0, y: 0 };
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

  const fitView = () => {
    if (!viewportElement || !layout.box.width || !layout.box.height) return;

    const fitted = fitDiagramToViewport({
      viewportWidth: viewportElement.clientWidth,
      viewportHeight: viewportElement.clientHeight,
      diagramWidth: layout.box.width,
      diagramHeight: layout.box.height,
      padding: DIAGRAM_VIEW_PADDING,
      minimumZoom: MIN_DIAGRAM_ZOOM,
      maximumZoom: MAX_DIAGRAM_ZOOM,
    });

    pan = fitted.pan;
    zoom = fitted.zoom;
  };

  const changeZoom = (nextZoom: number, point?: { x: number; y: number }) => {
    if (!viewportElement) return;

    const boundedZoom = clamp(
      nextZoom,
      MIN_DIAGRAM_ZOOM,
      MAX_DIAGRAM_ZOOM,
    );
    const zoomPoint = point ?? {
      x: viewportElement.clientWidth / 2,
      y: viewportElement.clientHeight / 2,
    };
    const nextViewport = zoomAroundPoint({ pan, zoom }, boundedZoom, zoomPoint);

    pan = nextViewport.pan;
    zoom = nextViewport.zoom;
  };

  const onWheel = (event: WheelEvent) => {
    if (!viewportElement) return;

    event.preventDefault();
    const bounds = viewportElement.getBoundingClientRect();
    const zoomPoint = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
    const zoomFactor = Math.exp(-event.deltaY * 0.0015);

    changeZoom(zoom * zoomFactor, zoomPoint);
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;

    const target = event.target as Element | null;
    if (target?.closest('[data-diagram-interactive], button')) return;

    activePointerId = event.pointerId;
    pointerOrigin = { x: event.clientX, y: event.clientY };
    panOrigin = pan;
    isPanning = true;
    viewportElement?.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!isPanning || event.pointerId !== activePointerId) return;

    pan = {
      x: panOrigin.x + event.clientX - pointerOrigin.x,
      y: panOrigin.y + event.clientY - pointerOrigin.y,
    };
  };

  const stopPanning = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId) return;

    isPanning = false;
    activePointerId = null;
  };

  const onViewportKeyDown = (event: KeyboardEvent) => {
    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      changeZoom(zoom + DIAGRAM_ZOOM_STEP);
    } else if (event.key === '-') {
      event.preventDefault();
      changeZoom(zoom - DIAGRAM_ZOOM_STEP);
    } else if (event.key === '0') {
      event.preventDefault();
      fitView();
    }
  };

  onMount(() => {
    requestAnimationFrame(fitView);
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
<div
  bind:this={viewportElement}
  class={[
    'relative size-full min-h-0 overflow-hidden rounded-sm outline-none touch-none',
    isPanning ? 'cursor-grabbing' : 'cursor-grab',
  ]}
  role="application"
  aria-label="Diagrama interactivo"
  aria-describedby="diagram-navigation-help"
  tabindex="0"
  onwheel={onWheel}
  onpointerdown={onPointerDown}
  onpointermove={onPointerMove}
  onpointerup={stopPanning}
  onpointercancel={stopPanning}
  onkeydown={onViewportKeyDown}
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
    style:transform={`translate(${pan.x}px, ${pan.y}px) scale(${zoom})`}
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
      disabled={zoom <= MIN_DIAGRAM_ZOOM}
      class="rounded p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
      onclick={() => changeZoom(zoom - DIAGRAM_ZOOM_STEP)}
    >
      <ZoomOut class="size-4" />
    </button>
    <output
      aria-label="Nivel de zoom"
      class="w-12 select-none text-center text-xs font-medium tabular-nums text-zinc-600"
    >
      {Math.round(zoom * 100)}%
    </output>
    <button
      type="button"
      aria-label="Acercar"
      title="Acercar (+)"
      disabled={zoom >= MAX_DIAGRAM_ZOOM}
      class="rounded p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
      onclick={() => changeZoom(zoom + DIAGRAM_ZOOM_STEP)}
    >
      <ZoomIn class="size-4" />
    </button>
    <div class="mx-1 h-5 w-px bg-zinc-200"></div>
    <button
      type="button"
      aria-label="Ajustar diagrama a la vista"
      title="Ajustar a la vista (0)"
      class="rounded p-1.5 text-zinc-600 hover:bg-zinc-100"
      onclick={fitView}
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
