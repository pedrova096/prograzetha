import { createId } from '@paralleldrive/cuid2';

import { Node, NodeStates, NodeTypes, type NodeState } from '../base';

export class StartNode extends Node<null> {
  constructor(
    id = createId(),
    type = NodeTypes.Start,
    data: null = null,
    state: NodeState = NodeStates.Ok,
  ) {
    super(id, type, data, undefined, state);
  }

  public static create() {
    return new StartNode();
  }
}
