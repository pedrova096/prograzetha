import jsep from 'jsep';

import { RuntimeActions, RuntimeNodes } from './runtime.types';
import type {
  GetRuntimeProgramOptions,
  RuntimeNode,
  RuntimeStepNode,
} from './runtime.types';
import {
  ConditionOperator,
  ConditionalNode,
  isConditionGroup,
  NodeTypes,
  type ConditionNode,
  type ConditionUnion,
} from '../nodes';
import { BranchEdge } from '../edge';
import type { InputNodeData } from '../nodes/inputNode';
import type { OperationNodeData } from '../nodes/operationNode';
import type { OutputNodeData } from '../nodes/outputNode';
import { LOGICAL_OPERATOR_EXPRESSION } from './runtime.constants';

function getExpressionFromConditionNode(condition: ConditionNode) {
  const left = jsep(condition.leftSide);
  const right = jsep(condition.rightSide);

  if (condition.operator === ConditionOperator.Includes) {
    return {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        computed: false,
        object: left,
        property: {
          type: 'Identifier',
          name: 'includes',
        },
      },
      arguments: [right],
    } satisfies jsep.CallExpression;
  }

  return {
    type: 'BinaryExpression',
    operator: condition.operator,
    left,
    right,
  } satisfies jsep.BinaryExpression;
}

export function getExpressionFromConditionUnion(
  condition: ConditionUnion,
): jsep.Expression {
  if (!isConditionGroup(condition)) {
    return getExpressionFromConditionNode(condition);
  }

  const [first, ...rest] = condition.children.map(
    getExpressionFromConditionUnion,
  );

  if (!first) {
    return {
      type: 'Literal',
      value: true,
      raw: 'true',
    } satisfies jsep.Literal;
  }

  return rest.reduce<jsep.Expression>((expression, child) => {
    return {
      type: 'BinaryExpression',
      operator: LOGICAL_OPERATOR_EXPRESSION[condition.logicalOperator],
      left: expression,
      right: child,
    } satisfies jsep.BinaryExpression;
  }, first);
}

function createStepNode(
  nodes: GetRuntimeProgramOptions['nodes'],
  id: string,
): RuntimeStepNode {
  const node = nodes.get(id);

  if (!node) {
    return {
      id,
      type: RuntimeNodes.Step,
      kind: 'operation',
      label: id,
      action: { type: RuntimeActions.Noop },
    };
  }

  switch (node.type) {
    case NodeTypes.Start:
      return {
        id: node.id,
        type: RuntimeNodes.Step,
        kind: 'start',
        label: 'Inicio',
        action: { type: RuntimeActions.Noop },
      };

    case NodeTypes.End:
      return {
        id: node.id,
        type: RuntimeNodes.Step,
        kind: 'end',
        label: 'Fin',
        action: { type: RuntimeActions.Noop },
      };

    case NodeTypes.Input: {
      const data = node.data as InputNodeData;

      return {
        id: node.id,
        type: RuntimeNodes.Step,
        kind: 'read',
        label: data.variable,
        action: {
          type: RuntimeActions.Input,
          variable: data.variable,
          prompt: data.variable,
        },
      };
    }

    case NodeTypes.Output: {
      const data = node.data as OutputNodeData;

      return {
        id: node.id,
        type: RuntimeNodes.Step,
        kind: 'write',
        label: data.text,
        action: {
          type: RuntimeActions.Alert,
          message: data.text,
        },
      };
    }

    case NodeTypes.Operation: {
      const data = node.data as OperationNodeData;

      return {
        id: node.id,
        type: RuntimeNodes.Step,
        kind: 'operation',
        label: `${data.leftSide} = ${data.rightSide}`,
        action: data.tree
          ? {
              type: RuntimeActions.Assign,
              variable: data.leftSide,
              expression: data.tree,
            }
          : { type: RuntimeActions.Noop },
      };
    }

    default:
      return {
        id: node.id,
        type: RuntimeNodes.Step,
        kind: 'operation',
        label: node.type,
        action: { type: RuntimeActions.Noop },
      };
  }
}

export function getRuntimeProgram(
  options: GetRuntimeProgramOptions,
  startId: string,
  stopId = '',
  visited = new Set<string>(),
): RuntimeNode[] {
  const children: RuntimeNode[] = [];
  let currentId = startId;

  while (currentId && currentId !== stopId && !visited.has(currentId)) {
    const node = options.nodes.get(currentId);
    const edge = options.edges.get(currentId);

    if (!node) {
      break;
    }

    visited.add(currentId);

    if (node instanceof ConditionalNode && edge instanceof BranchEdge) {
      children.push({
        id: currentId,
        condition: getExpressionFromConditionUnion(node.data.conditions),
        type: RuntimeNodes.Branch,
        label: '',
        then: getRuntimeProgram(
          options,
          edge.left,
          edge.target,
          new Set(visited),
        ),
        else: getRuntimeProgram(
          options,
          edge.right,
          edge.target,
          new Set(visited),
        ),
      });

      currentId = edge.target;
      continue;
    }

    const block = createStepNode(options.nodes, currentId);

    if (block) {
      children.push(block);
    }

    currentId = edge?.target ?? '';
  }

  return children;
}
