import { createId } from '@paralleldrive/cuid2';

import { Node, NodeTypes, type NodeState } from '../base';
import type { OperationNodeData } from './operationNode.types';

const DEFAULT_OPERATION_DATA: OperationNodeData = {
  leftSide: '',
  rightSide: '',
  tree: null,
  leftMeta: { isDeclaration: false, type: 'null' },
};

export class OperationNode extends Node<OperationNodeData> {
  constructor(
    id = createId(),
    type = NodeTypes.Operation,
    data = DEFAULT_OPERATION_DATA,
    state?: NodeState,
  ) {
    super(id, type, data, undefined, state);
  }

  public static create() {
    return new OperationNode();
  }

  public static nodeIs(node: Node): node is OperationNode {
    return node.type === NodeTypes.Operation;
  }

  /*
  toAST(
    options: OperationNodeOptions = { variables: [] },
  ): ExpressionStatement | VariableDeclaration {
    const { variables } = options;
    if (this.data.leftMeta.isNew || !variables.includes(this.data.leftSide)) {
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
  */

  public withUpdate(data = this.data, state = this.state) {
    return new OperationNode(this.id, this.type, data, state);
  }
}
