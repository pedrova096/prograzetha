import { createId } from '@paralleldrive/cuid2';

import { Node, NodeTypes } from '../base';

export class EndNode extends Node {
  constructor() {
    super(createId(), NodeTypes.End, null);
  }

  public static create() {
    return new EndNode();
  }
}
