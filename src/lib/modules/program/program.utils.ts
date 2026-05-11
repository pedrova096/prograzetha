import { BranchEdge } from '../edge';
import { NodeTypes } from '../nodes';
import type { GetASTOptions } from './program.types';

const createAST = (
  options: GetASTOptions,
  startId: string,
  stopId = '',
  visited = new Set<string>(),
) => {
  const tree = [];
  let currentId = startId;

  while (currentId && currentId !== stopId && !visited.has(currentId)) {
    const node = options.nodes.get(currentId);
    const edge = options.edges.get(currentId);

    if (!node) {
      break;
    }

    visited.add(currentId);

    if (node.type === NodeTypes.Condition && edge instanceof BranchEdge) {
    }

    tree.push(node.toAST());
  }
};

export const getAST = (options: GetASTOptions, startId: string) => {
  return createAST(options, startId);
};
