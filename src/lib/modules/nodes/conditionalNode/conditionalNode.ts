import { createId } from '@paralleldrive/cuid2';
import type { IfStatement } from 'estree';

import { Node, NodeTypes, type NodeState } from '../base';
import type { ConditionalNodeData } from './conditionalNode.types';

export class ConditionalNode extends Node<ConditionalNodeData> {
  constructor(
    id = createId(),
    type = NodeTypes.Condition,
    data = {} as ConditionalNodeData,
    state?: NodeState,
  ) {
    super(id, type, data, undefined, state);
  }

  public static create() {
    return new ConditionalNode();
  }
  toAST(value?: unknown): IfStatement {
    return {};
  }

  public withUpdate(data = this.data, state = this.state) {
    return new ConditionalNode(this.id, this.type, data, state);
  }
}
