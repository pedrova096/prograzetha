import { createId } from '@paralleldrive/cuid2';

import { Node, NodeTypes, type NodeState } from '../base';
import type { OperationNodeData } from './operationNode.types';

const DEFAULT_OPERATION_DATA: OperationNodeData = {
  leftSide: '',
  rightSide: '',
  tree: null,
  leftMeta: { isDeclaration: false, type: 'null' },
};

export class OperationNode extends Node<OperationNodeData> {
  constructor(
    id = createId(),
    type = NodeTypes.Operation,
    data = DEFAULT_OPERATION_DATA,
    state?: NodeState,
  ) {
    super(id, type, data, undefined, state);
  }

  public static create() {
    return new OperationNode();
  }

  public static nodeIs(node: Node): node is OperationNode {
    return node.type === NodeTypes.Operation;
  }

  public withUpdate(data = this.data, state = this.state) {
    return new OperationNode(this.id, this.type, data, state);
  }
}
