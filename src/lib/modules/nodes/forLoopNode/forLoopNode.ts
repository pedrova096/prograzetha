import { createId } from '@paralleldrive/cuid2';

import { Node, NodeTypes, type NodeState } from '../base';
import type { ForLoopNodeData } from './forLoopNode.types';
import { createDefaultForLoopData } from './forLoopNode.utils';

export class ForLoopNode extends Node<ForLoopNodeData> {
  constructor(
    id = createId(),
    type = NodeTypes.ForLoop,
    data = createDefaultForLoopData(),
    state?: NodeState,
  ) {
    super(id, type, data, undefined, state);
  }

  public static create() {
    return new ForLoopNode();
  }

  public static nodeIs(node: Node): node is ForLoopNode {
    return node.type === NodeTypes.ForLoop;
  }

  public withUpdate(data = this.data, state = this.state) {
    return new ForLoopNode(this.id, this.type, data, state);
  }
}
