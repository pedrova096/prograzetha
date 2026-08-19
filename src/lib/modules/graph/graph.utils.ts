import type { Node } from '../nodes';
import type { NodesFailReason } from './graph.types';

export const checkInvalidNodeState = (
  nodes: Map<string, Node>,
): true | NodesFailReason => {
  const nodesList = Array.from(nodes.values());

  let failReason: NodesFailReason | undefined;
  while (nodesList.length) {
    const node = nodesList.pop()!;
    if (node.state === 'error') {
      failReason = 'ERROR';
      break;
    }

    if (node.state === 'new') {
      failReason = 'NEW';
    }
  }

  if (failReason) {
    return failReason;
  }

  return true;
};
