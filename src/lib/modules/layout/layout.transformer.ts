import { BranchEdge, LoopEdge } from '~/lib/modules/edge';
import { isLoopNode, NodeStates, NodeTypes } from '~/lib/modules/nodes';

import {
  BLOCK_HEIGHT,
  BLOCK_OK_EXTRA_HEIGHT,
  BLOCK_WIDTH,
  BlockLayout,
} from './block';
import { BranchLayout } from './branch';
import { LoopLayout } from './loop';
import type {
  GetLayoutOptions,
  LayoutBlock,
  LayoutResult,
} from './layout.types';
import { VStackLayout } from './vstack';

const createNodeBlock = (options: GetLayoutOptions, id: string) => {
  const node = options.nodes.get(id);

  if (!node) {
    return null;
  }
  const shouldHaveExtraHeight =
    node.type !== NodeTypes.Start &&
    node.type !== NodeTypes.End &&
    node.state === NodeStates.Ok;

  const height =
    BLOCK_HEIGHT + (shouldHaveExtraHeight ? BLOCK_OK_EXTRA_HEIGHT : 0);

  return BlockLayout.create(node.id, node.type, BLOCK_WIDTH, height);
};

const createSequenceBlock = (
  options: GetLayoutOptions,
  startId: string,
  stopId = '',
  visited = new Set<string>(),
): LayoutBlock => {
  const children: LayoutBlock[] = [];
  let currentId = startId;

  while (currentId && currentId !== stopId && !visited.has(currentId)) {
    const node = options.nodes.get(currentId);
    const edge = options.edges.get(currentId);

    if (!node) {
      break;
    }

    visited.add(currentId);

    if (node.type === NodeTypes.Condition && edge instanceof BranchEdge) {
      const condition = createNodeBlock(options, currentId);

      if (condition) {
        children.push(
          BranchLayout.create({
            id: currentId,
            condition,
            then: createSequenceBlock(
              options,
              edge.left,
              edge.target,
              new Set(visited),
            ),
            else: createSequenceBlock(
              options,
              edge.right,
              edge.target,
              new Set(visited),
            ),
          }),
        );
      }

      currentId = edge.target;
      continue;
    }

    if (isLoopNode(node) && edge instanceof LoopEdge) {
      const condition = createNodeBlock(options, currentId);

      if (condition) {
        children.push(
          LoopLayout.create({
            id: currentId,
            condition,
            body: createSequenceBlock(
              options,
              edge.body,
              currentId,
              new Set(visited),
            ),
          }),
        );
      }

      currentId = edge.target;
      continue;
    }

    const block = createNodeBlock(options, currentId);

    if (block) {
      children.push(block);
    }

    currentId = edge?.target ?? '';
  }

  return VStackLayout.create({
    id: startId,
    children,
  });
};

export const getLayout = (
  options: GetLayoutOptions,
  startId: string,
): LayoutResult => {
  return createSequenceBlock(options, startId).layout({
    x: 0,
    y: 0,
  });
};
