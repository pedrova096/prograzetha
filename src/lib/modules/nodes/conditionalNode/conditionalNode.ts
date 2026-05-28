import { createId } from '@paralleldrive/cuid2';
import type { IfStatement } from 'estree';

import { Node, NodeTypes, type NodeState } from '../base';
import { createDefaultConditionalData } from './conditionalNode.utils';
import type { ConditionalNodeData } from './conditionalNode.types';

export class ConditionalNode extends Node<ConditionalNodeData> {
  constructor(
    id = createId(),
    type = NodeTypes.Condition,
    data = createDefaultConditionalData(),
    state?: NodeState,
  ) {
    super(id, type, data, undefined, state);
  }

  public static create() {
    return new ConditionalNode();
  }

  public static nodeIs(node: Node): node is ConditionalNode {
    return node.type === NodeTypes.Condition;
  }

  toAST(value?: unknown): IfStatement {
    throw new Error('Not implemented');
  }

  public withUpdate(data = this.data, state = this.state) {
    return new ConditionalNode(this.id, this.type, data, state);
  }
}
