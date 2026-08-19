import { NodeStates, NodeTypes, type NodeState, Node } from './base';
import { ConditionalNode } from './conditionalNode';
import { EndNode } from './endNode';
import { InputNode } from './inputNode';
import { OperationNode } from './operationNode';
import { OutputNode } from './outputNode';
import { StartNode } from './startNode';

export const createNode = <T>(options: {
  id?: string;
  type: NodeTypes;
  state?: NodeState;
  data?: T;
  next?: Node;
  prev?: Node;
}) => {
  const { id, type, data, state = NodeStates.New } = options;

  switch (type) {
    case NodeTypes.Start:
      return new StartNode(id, type, data as StartNode['data'], state);
    case NodeTypes.End:
      return new EndNode(id, type, data as EndNode['data'], state);
    case NodeTypes.Input:
      return new InputNode(id, type, data as InputNode['data'], state);
    case NodeTypes.Output:
      return new OutputNode(id, type, data as OutputNode['data'], state);
    case NodeTypes.Condition:
      return new ConditionalNode(
        id,
        type,
        data as ConditionalNode['data'],
        state,
      );
    case NodeTypes.Operation:
      return new OperationNode(id, type, data as OperationNode['data'], state);
    case NodeTypes.Loop:
      // TODO change when loop implemented:
      return new Node(id!, type, data, undefined, state);
    default:
      throw new Error(`Unsupported node type: ${type}`);
  }
};
