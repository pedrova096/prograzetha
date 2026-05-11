import { createId } from '@paralleldrive/cuid2';

import { NodeStates, NodeTypes, type NodeState, Node } from './base';
import { ConditionalNode } from './conditionalNode';
import { EndNode } from './endNode';
import { InputNode } from './inputNode';
import { OperationNode } from './operationNode';
import { OutputNode } from './outputNode';
import { StartNode } from './startNode';

const applyNodeOptions = <T>(
  node: Node,
  data: T | undefined,
  state: NodeState,
) => {
  return node.withUpdate(data === undefined ? node.data : data, state);
};

export const createNode = <T>(options: {
  type: NodeTypes;
  state?: NodeState;
  data?: T;
  next?: Node;
  prev?: Node;
}) => {
  const { type, data, state = NodeStates.New } = options;

  switch (type) {
    case NodeTypes.Start:
      return applyNodeOptions(StartNode.create(), data, state);
    case NodeTypes.End:
      return applyNodeOptions(EndNode.create(), data, state);
    case NodeTypes.Input:
      return applyNodeOptions(InputNode.create(), data, state);
    case NodeTypes.Output:
      return applyNodeOptions(OutputNode.create(), data, state);
    case NodeTypes.Condition:
      return applyNodeOptions(ConditionalNode.create(), data, state);
    case NodeTypes.Operation:
      return applyNodeOptions(OperationNode.create(), data, state);
    case NodeTypes.Loop:
      return applyNodeOptions(
        new Node(createId(), NodeTypes.Loop, null, undefined, state),
        data,
        state,
      );
    default:
      throw new Error(`Unsupported node type: ${type}`);
  }
};
