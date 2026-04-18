<script lang="ts">
  import { Diagram, Node } from '~/lib/components';
  import { getDiagramContext } from '~/App.context.svelte';
  import type {
    ConditionEdge,
    ConditionNodeProps,
  } from './ConditionNode.types';
  import { roundedCornerPath } from './ConditionNode.utils';
  import { AddButton } from '../AddButton';

  let { node }: ConditionNodeProps = $props();

  let {
    diagram: { edges },
  } = getDiagramContext();

  let isOpen = $state(true);
  let left = $derived((edges.get(node.id) as ConditionEdge)?.left);
  let right = $derived((edges.get(node.id) as ConditionEdge)?.right);

  const onClickHandler = () => {
    isOpen = !isOpen;
  };

  const CURVE_RADIUS = 6;
  const CURVE_SIZE = 10;
  const CURVE_STROKE = 2;

  const curveLeftTopPath = roundedCornerPath({
    position: { x: 0, y: CURVE_SIZE },
    size: {
      width: CURVE_SIZE + CURVE_STROKE,
      height: CURVE_SIZE + CURVE_STROKE,
    },
    direction: { x: -1, y: 1 },
    radius: CURVE_RADIUS,
    stroke: CURVE_STROKE,
  });
  const curveRightBottomPath = roundedCornerPath({
    position: { x: 0, y: 0 },
    size: {
      width: CURVE_SIZE,
      height: CURVE_SIZE + CURVE_STROKE,
    },
    direction: { x: 1, y: -1 },
    radius: CURVE_RADIUS,
    stroke: CURVE_STROKE,
  });

  const curveLeftBottomPath = roundedCornerPath({
    position: { x: 0, y: 0 },
    size: {
      width: CURVE_SIZE,
      height: CURVE_SIZE + CURVE_STROKE,
    },
    direction: { x: -1, y: -1 },
    radius: CURVE_RADIUS,
    stroke: CURVE_STROKE,
  });
  const curveRightTopPath = roundedCornerPath({
    position: { x: 0, y: CURVE_SIZE },
    size: {
      width: CURVE_SIZE,
      height: CURVE_SIZE + CURVE_STROKE,
    },
    direction: { x: 1, y: 1 },
    radius: CURVE_RADIUS,
    stroke: CURVE_STROKE,
  });
</script>

<Node {node} onclick={onClickHandler} />

<div class="flex flex-col -mt-1">
  {#if isOpen}
    <div class="flex flex-col">
      <div
        id="connection-svg-top"
        class="w-[calc(50%+10px)] mx-auto flex flex-row"
      >
        <div class="flex-1 flex flex-row">
          <svg class="text-blue-500" width={CURVE_SIZE} height={CURVE_SIZE * 2}>
            <path
              id="curve-bottom-left"
              class="fill-transparent stroke-2 stroke-current"
              d={curveLeftTopPath}
            />
          </svg>

          <div class="flex-1">
            <svg class="text-blue-500" width="100%" height={CURVE_SIZE * 2}>
              <path
                id="line-left"
                class="fill-transparent stroke-2 stroke-current"
                d="M 0 11 L 900 11"
              />
            </svg>
          </div>

          <svg class="text-blue-500" width={CURVE_SIZE} height={CURVE_SIZE * 2}>
            <path
              id="curve-bottom-left"
              class="fill-transparent stroke-2 stroke-current"
              d={curveRightBottomPath}
            />
          </svg>
        </div>

        <div class="flex-1 flex flex-row">
          <svg class="text-blue-500" width={CURVE_SIZE} height={CURVE_SIZE * 2}>
            <path
              id="curve-bottom-left"
              class="fill-transparent stroke-2 stroke-current"
              d={curveLeftBottomPath}
            />
          </svg>

          <div class="flex-1">
            <svg class="text-blue-500" width="100%" height={CURVE_SIZE * 2}>
              <path
                id="line-left"
                class="fill-transparent stroke-2 stroke-current"
                d="M 0 11 L 900 11"
              />
            </svg>
          </div>

          <svg class="text-blue-500" width={CURVE_SIZE} height={CURVE_SIZE * 2}>
            <path
              id="curve-bottom-left"
              class="fill-transparent stroke-2 stroke-current"
              d={curveRightTopPath}
            />
          </svg>
        </div>
      </div>

      <div id="side-diagram-container" class="flex flex-row gap-4">
        {#if left}
          <div
            class="flex-1 p-2 flex flex-col border border-red-300 rounded-sm gap-1 items-center"
          >
            <AddButton circle={false} />
            <Diagram from={left} />
          </div>
        {/if}

        {#if right}
          <div
            class="flex-1 p-2 flex flex-col border border-red-300 rounded-sm gap-1 items-center"
          >
            <AddButton circle={false} />
            <Diagram from={right} />
          </div>
        {/if}
      </div>

      <div
        id="connection-svg-bottom"
        class="w-[calc(50%+10px)] mx-auto flex flex-row"
      >
        <div class="flex-1 flex flex-row justify-between">
          <svg width={CURVE_SIZE} height={CURVE_SIZE * 2}>
            <path
              id="curve-bottom-left"
              class="fill-transparent stroke-2 stroke-current"
              d={curveLeftBottomPath}
            />
          </svg>
          <div class="flex-1">
            <svg width="100%" height={CURVE_SIZE * 2}>
              <path
                id="line-left"
                class="fill-transparent stroke-2 stroke-current"
                d="M 0 11 L 900 11"
              />
            </svg>
          </div>
          <svg width={CURVE_SIZE} height={CURVE_SIZE * 2}>
            <path
              id="curve-bottom-left"
              class="fill-transparent stroke-2 stroke-current"
              d={curveRightTopPath}
            />
          </svg>
        </div>

        <div class="flex-1 flex flex-row justify-between">
          <svg width={CURVE_SIZE} height={CURVE_SIZE * 2}>
            <path
              id="curve-bottom-left"
              class="fill-transparent stroke-2 stroke-current"
              d={curveLeftTopPath}
            />
          </svg>
          <div class="flex-1">
            <svg width="100%" height={CURVE_SIZE * 2}>
              <path
                id="line-left"
                class="fill-transparent stroke-2 stroke-current"
                d="M 0 11 L 900 11"
              />
            </svg>
          </div>

          <svg width={CURVE_SIZE} height={CURVE_SIZE * 2}>
            <path
              id="curve-bottom-left"
              class="fill-transparent stroke-2 stroke-current"
              d={curveRightBottomPath}
            />
          </svg>
        </div>
      </div>
    </div>
  {/if}
</div>
