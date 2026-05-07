import { ConditionalEdge } from '~/lib/modules/edge';
import { NodeTypes } from '~/lib/modules/nodes';

import { BlockLayout } from './block';
import { BranchLayout } from './branch';
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

  return BlockLayout.create(node.id, node.type);
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

    if (node.type === NodeTypes.Condition && edge instanceof ConditionalEdge) {
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
