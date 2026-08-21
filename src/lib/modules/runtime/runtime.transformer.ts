import { RuntimeActions, RuntimeNodes } from './runtime.types';
import type {
  GetRuntimeProgramOptions,
  RuntimeNode,
  RuntimeStepNode,
} from './runtime.types';
import {
  ConditionalNode,
  ForLoopNode,
  NodeTypes,
  WhileLoopNode,
  isLoopNode,
} from '../nodes';
import { BranchEdge, LoopEdge } from '../edge';
import type { InputNodeData } from '../nodes/inputNode';
import type { OperationNodeData } from '../nodes/operationNode';
import type { OutputNodeData } from '../nodes/outputNode';
import { createConditionExpression, createLiteral } from '../ir';

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
        label: data.name,
        action: {
          type: RuntimeActions.Input,
          variable: data.name,
          inputType: data.type,
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
          expression: data.expression,
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
        condition: createConditionExpression(node.data.conditions),
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

    if (isLoopNode(node) && edge instanceof LoopEdge) {
      const body = getRuntimeProgram(
        options,
        edge.body,
        node.id,
        new Set(visited),
      );

      if (WhileLoopNode.nodeIs(node)) {
        children.push({
          id: currentId,
          type: RuntimeNodes.WhileLoop,
          label: 'Mientras',
          condition: createConditionExpression(node.data.conditions),
          body,
        });
      } else if (ForLoopNode.nodeIs(node)) {
        children.push({
          id: currentId,
          type: RuntimeNodes.ForLoop,
          label: `Para ${node.data.iterator}`,
          iterator: node.data.iterator,
          start: createLiteral(node.data.start),
          end: createLiteral(node.data.end),
          step: createLiteral(node.data.step),
          body,
        });
      }

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
