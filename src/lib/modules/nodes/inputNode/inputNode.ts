import { createId } from '@paralleldrive/cuid2';
import type { VariableDeclaration } from 'estree';

import { Node, NodeTypes, type NodeState } from '../base';
import type { InputNodeData } from './inputNode.types';

export class InputNode extends Node<InputNodeData> {
  constructor(
    id = createId(),
    type = NodeTypes.Input,
    data = { name: '', type: 'string' } as InputNodeData,
    state?: NodeState,
  ) {
    super(id, type, data, undefined, state);
  }

  public static create() {
    return new InputNode();
  }

  public static nodeIs(node: Node): node is InputNode {
    return node.type === NodeTypes.Input;
  }

  /*
  toAST(value?: unknown): VariableDeclaration {
    return {
      type: 'VariableDeclaration',
      declarations: [
        {
          type: 'VariableDeclarator',
          id: {
            type: 'Identifier',
            name: this.data.variable,
          },
          init: {
            type: 'Literal',
            value: value as string | number | boolean,
          },
        },
      ],
      kind: 'let',
    };
  }
  */

  public withUpdate(data = this.data, state = this.state) {
    return new InputNode(this.id, this.type, data, state);
  }
}
