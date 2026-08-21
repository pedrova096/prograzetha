import { createId } from '@paralleldrive/cuid2';

import { Node, NodeTypes, type NodeState } from '../base';
import type { WhileLoopNodeData } from './whileLoopNode.types';
import { createDefaultWhileLoopData } from './whileLoopNode.utils';

export class WhileLoopNode extends Node<WhileLoopNodeData> {
  constructor(
    id = createId(),
    type = NodeTypes.WhileLoop,
    data = createDefaultWhileLoopData(),
    state?: NodeState,
  ) {
    super(id, type, data, undefined, state);
  }

  public static create() {
    return new WhileLoopNode();
  }

  public static nodeIs(node: Node): node is WhileLoopNode {
    return node.type === NodeTypes.WhileLoop;
  }

  public withUpdate(data = this.data, state = this.state) {
    return new WhileLoopNode(this.id, this.type, data, state);
  }
}
