import { createId } from '@paralleldrive/cuid2';

import { Node, NodeStates, NodeTypes, type NodeState } from '../base';

export class EndNode extends Node<null> {
  constructor(
    id = createId(),
    type = NodeTypes.End,
    data: null = null,
    state: NodeState = NodeStates.Ok,
  ) {
    super(id, type, data, undefined, state);
  }

  public static create() {
    return new EndNode();
  }
}
