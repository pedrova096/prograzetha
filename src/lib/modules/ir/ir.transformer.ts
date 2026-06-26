import { BranchEdge } from '../edge';
import {
  ConditionalNode,
  InputNode,
  OperationNode,
  OutputNode,
} from '../nodes';
import {
  IRKind,
  type ExpressionIR,
  type GetIROptions,
  type ProgramIR,
  type StatementIR,
} from './ir.types';
import {
  createConditionExpression,
  createExpression,
  createIdentifier,
  createIdentifierPattern,
  createLiteral,
} from './ir.utils';

const createOutputExpression = (node: OutputNode): ExpressionIR => ({
  kind: IRKind.CallExpression,
  callee: createIdentifier('output'),
  args: [
    node.data.expression
      ? createExpression(node.data.expression)
      : createLiteral(node.data.text),
  ],
});

const createStatements = (
  options: GetIROptions,
  startId: string,
  stopId = '',
  visited = new Set<string>(),
): StatementIR[] => {
  const body: StatementIR[] = [];
  let currentId = startId;

  while (currentId && currentId !== stopId && !visited.has(currentId)) {
    const node = options.nodes.get(currentId);
    const edge = options.edges.get(currentId);

    if (!node) {
      break;
    }

    visited.add(currentId);

    if (InputNode.nodeIs(node)) {
      body.push({
        kind: IRKind.VariableDeclaration,
        name: node.data.name,
        valueType: node.data.type,
        init: {
          kind: IRKind.CallExpression,
          callee: createIdentifier('input'),
          args: [createLiteral(node.data.name)],
        },
      });
    } else if (OperationNode.nodeIs(node)) {
      if (node.data.tree) {
        if (node.data.leftMeta.isDeclaration) {
          body.push({
            kind: IRKind.VariableDeclaration,
            name: node.data.leftSide,
            valueType: node.data.leftMeta.type,
            init: createExpression(node.data.tree),
          });
        } else {
          body.push({
            kind: IRKind.Assignment,
            target: createIdentifierPattern(node.data.leftSide),
            value: createExpression(node.data.tree),
          });
        }
      }
    } else if (OutputNode.nodeIs(node)) {
      body.push({
        kind: IRKind.ExpressionStatement,
        expression: createOutputExpression(node),
      });
    } else if (ConditionalNode.nodeIs(node) && edge instanceof BranchEdge) {
      const alternate = createStatements(
        options,
        edge.right,
        edge.target,
        new Set(visited),
      );

      body.push({
        kind: IRKind.If,
        test: createConditionExpression(node.data.conditions),
        consequent: createStatements(
          options,
          edge.left,
          edge.target,
          new Set(visited),
        ),
        alternate,
      });
    }

    currentId = edge?.target ?? '';
  }

  return body;
};

export const getIR = (options: GetIROptions, startId: string): ProgramIR => ({
  kind: IRKind.Program,
  body: createStatements(options, startId),
});
