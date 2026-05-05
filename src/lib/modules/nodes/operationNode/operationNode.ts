import { createId } from '@paralleldrive/cuid2';
import type {
  Expression,
  ExpressionStatement,
  VariableDeclaration,
} from 'estree';

import { Node, NodeTypes } from '../base';
import type {
  OperationNodeData,
  OperationNodeOptions,
} from './operationNode.types';

const DEFAULT_OPERATION_DATA: OperationNodeData = {
  leftSide: '',
  rightSide: '',
  tree: null,
};

export class OperationNode extends Node<OperationNodeData> {
  constructor(
    id = createId(),
    type = NodeTypes.Operation,
    data = DEFAULT_OPERATION_DATA,
  ) {
    super(id, type, data);
  }

  public static create() {
    return new OperationNode();
  }

  toAST(
    options: OperationNodeOptions = { variables: [] },
  ): ExpressionStatement | VariableDeclaration {
    const { variables } = options;
    if (!variables.includes(this.data.leftSide)) {
      return {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: {
              type: 'Identifier',
              name: this.data.leftSide,
            },
            init: this.data.tree as Expression,
          },
        ],
        kind: 'let',
      };
    }

    return {
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        operator: '=',
        left: {
          type: 'Identifier',
          name: this.data.leftSide,
        },
        right: this.data.tree as Expression,
      },
    };
  }

  public withData(data: OperationNodeData) {
    return new OperationNode(this.id, this.type, data);
  }
}
