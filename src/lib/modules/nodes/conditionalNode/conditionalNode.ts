import { createId } from '@paralleldrive/cuid2';

import { Node, NodeTypes } from '../base';
import type { ConditionalNodeData } from './conditionalNode.types';

export class ConditionalNode extends Node<ConditionalNodeData> {
  constructor() {
    super(createId(), NodeTypes.Condition, {});
  }

  public static create() {
    return new ConditionalNode();
  }
}
