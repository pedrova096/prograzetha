import { createId } from '@paralleldrive/cuid2';
import type { VariableDeclaration } from 'estree';

import { Node, NodeTypes } from '../base';
import { InputTraceCallbackNode } from './inputNode.trace';
import type { InputNodeData } from './inputNode.types';

export class InputNode extends Node<InputNodeData> {
  constructor(
    id = createId(),
    type = NodeTypes.Input,
    data = { variable: '' } as InputNodeData,
  ) {
    super(id, type, data);
  }

  public static create() {
    return new InputNode();
  }

  public static nodeIs(node: Node): node is InputNode {
    return node.type === NodeTypes.Input;
  }

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

  public withData(data: InputNodeData) {
    return new InputNode(this.id, this.type, data);
  }

  public getTrace(): InputTraceCallbackNode {
    return new InputTraceCallbackNode(this.data);
  }
}
