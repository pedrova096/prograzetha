import { createId } from '@paralleldrive/cuid2';

import { Node, NodeTypes } from '../base';

export class StartNode extends Node {
  constructor() {
    super(createId(), NodeTypes.Start, null);
  }

  public static create() {
    return new StartNode();
  }
}
