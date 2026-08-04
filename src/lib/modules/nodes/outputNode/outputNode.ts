import { createId } from '@paralleldrive/cuid2';

import { Node, NodeTypes, type NodeState } from '../base';
import type { OutputNodeData } from './outputNode.types';

export class OutputNode extends Node<OutputNodeData> {
  constructor(
    id = createId(),
    type = NodeTypes.Output,
    data = { text: '', tree: null } as OutputNodeData,
    state?: NodeState,
  ) {
    super(id, type, data, undefined, state);
  }

  public static create() {
    return new OutputNode();
  }

  public static nodeIs(node: Node): node is OutputNode {
    return node.type === NodeTypes.Output;
  }

  public withUpdate(data = this.data, state = this.state) {
    return new OutputNode(this.id, this.type, data, state);
  }
}
