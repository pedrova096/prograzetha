import { createId } from '@paralleldrive/cuid2';

import { BranchEdge, Edge } from '../edge';
import {
  ConditionOperator,
  ConditionalNode,
  EndNode,
  InputNode,
  LogicalOperator,
  OperationNode,
  OutputNode,
  StartNode,
  isConditionNode,
  type ConditionGroup,
  type ConditionUnion,
} from '../nodes';
import {
  BinaryOperator,
  ExpressionKind,
  LogicalOperatorExpression,
  type CallExpression,
  type Expression,
} from '../expression';
import { LiteralVariants } from '~/lib/constants';
import { inferExpressionType, InferredType } from '~/utils';

import {
  IRKind,
  type AssignmentIR,
  type ExpressionStatementIR,
  type GetIROptions,
  type GraphFromProgramResult,
  type ProgramIR,
  type StatementIR,
  type VariableDeclarationIR,
} from './ir.types';
import {
  createCallExpression,
  createConditionExpression,
  createLiteral,
} from './ir.utils';

type ExpressionEncoder = (expression: Expression) => string;

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
        init: createCallExpression('input', [createLiteral(node.data.name)]),
      });
    } else if (OperationNode.nodeIs(node) && node.data.tree) {
      if (node.data.leftMeta.isDeclaration) {
        body.push({
          kind: IRKind.VariableDeclaration,
          name: node.data.leftSide,
          valueType: node.data.leftMeta.type,
          init: node.data.tree,
        });
      } else {
        body.push({
          kind: IRKind.Assignment,
          target: {
            kind: IRKind.IdentifierPattern,
            name: node.data.leftSide,
          },
          value: node.data.tree,
        });
      }
    } else if (OutputNode.nodeIs(node)) {
      body.push({
        kind: IRKind.ExpressionStatement,
        expression: createCallExpression('output', [
          node.data.expression ?? createLiteral(node.data.text),
        ]),
      });
    } else if (ConditionalNode.nodeIs(node) && edge instanceof BranchEdge) {
      body.push({
        kind: IRKind.If,
        test: createConditionExpression(node.data.conditions),
        consequent: createStatements(
          options,
          edge.left,
          edge.target,
          new Set(visited),
        ),
        alternate: createStatements(
          options,
          edge.right,
          edge.target,
          new Set(visited),
        ),
      });
    }

    currentId = edge?.target ?? '';
  }

  return body;
};

export const getIRFromGraph = (
  options: GetIROptions,
  startId: string,
): ProgramIR => ({
  kind: IRKind.Program,
  body: createStatements(options, startId),
});

const expressionToText = (expression: Expression): string => {
  switch (expression.kind) {
    case ExpressionKind.Literal:
      return expression.value as string;
    case ExpressionKind.Identifier:
      return `$${expression.name}`;
    case ExpressionKind.BinaryExpression:
      return `${expressionToText(expression.left)} ${expressionToText(
        expression.right,
      )}`;
    default:
      return '';
  }
};

const mapInferredType = (expression: Expression): `${LiteralVariants}` => {
  switch (inferExpressionType(expression)) {
    case InferredType.String:
      return LiteralVariants.String;
    case InferredType.Number:
      return LiteralVariants.Number;
    case InferredType.Boolean:
      return LiteralVariants.Boolean;
    case InferredType.Null:
      return LiteralVariants.Null;
    default:
      return LiteralVariants.Null;
  }
};

const isNamedCall = (expression: Expression, name: string) =>
  expression.kind === ExpressionKind.CallExpression &&
  expression.callee.kind === ExpressionKind.Identifier &&
  expression.callee.name === name;

const createInputNode = (statement: VariableDeclarationIR): InputNode => {
  const init = statement.init as CallExpression;
  const [prompt] = init.args;
  const name =
    prompt?.kind === ExpressionKind.Literal && typeof prompt.value === 'string'
      ? prompt.value
      : statement.name;

  return new InputNode(undefined, undefined, {
    name: statement.name || name,
    type: 'string',
  });
};

const createOperationFromDeclaration = (
  statement: VariableDeclarationIR,
  expressionEncoder: ExpressionEncoder,
): OperationNode =>
  new OperationNode(undefined, undefined, {
    leftSide: statement.name,
    rightSide: statement.init ? expressionEncoder(statement.init) : 'null',
    tree: statement.init ?? createLiteral(null),
    leftMeta: {
      isDeclaration: true,
      type: statement.init
        ? mapInferredType(statement.init)
        : LiteralVariants.Null,
    },
  });

const createOperationFromAssignment = (
  statement: AssignmentIR,
  expressionEncoder: ExpressionEncoder,
): OperationNode =>
  new OperationNode(undefined, undefined, {
    leftSide: statement.target.name,
    rightSide: expressionEncoder(statement.value),
    tree: statement.value,
    leftMeta: {
      isDeclaration: false,
      type: mapInferredType(statement.value),
    },
  });

const createOutputNode = (statement: ExpressionStatementIR): OutputNode => {
  const expression = statement.expression as CallExpression;
  const value = expression.args[0] ?? createLiteral('');

  return new OutputNode(undefined, undefined, {
    text: expressionToText(value),
    expression: value,
  });
};

const CONDITION_BINARY_OPERATORS: Partial<
  Record<BinaryOperator, ConditionOperator>
> = {
  [BinaryOperator.Equals]: ConditionOperator.Equals,
  [BinaryOperator.NotEquals]: ConditionOperator.NotEquals,
  [BinaryOperator.GreaterThan]: ConditionOperator.GreaterThan,
  [BinaryOperator.GreaterThanOrEqual]: ConditionOperator.GreaterThanOrEqual,
  [BinaryOperator.LessThan]: ConditionOperator.LessThan,
  [BinaryOperator.LessThanOrEqual]: ConditionOperator.LessThanOrEqual,
};

const LOGICAL_CONDITION_OPERATORS: Record<
  LogicalOperatorExpression,
  LogicalOperator
> = {
  [LogicalOperatorExpression.And]: LogicalOperator.And,
  [LogicalOperatorExpression.Or]: LogicalOperator.Or,
};

const createConditionId = () => createId();

const expressionToCondition = (
  expression: Expression,
  expressionEncoder: ExpressionEncoder,
): ConditionUnion => {
  if (expression.kind === ExpressionKind.LogicalExpression) {
    return {
      id: createConditionId(),
      logicalOperator: LOGICAL_CONDITION_OPERATORS[expression.operator],
      children: [
        expressionToCondition(expression.left, expressionEncoder),
        expressionToCondition(expression.right, expressionEncoder),
      ],
    };
  }

  if (expression.kind === ExpressionKind.BinaryExpression) {
    const operator = CONDITION_BINARY_OPERATORS[expression.operator];

    if (!operator) {
      return {
        id: createConditionId(),
        leftSide: expressionEncoder(expression),
        rightSide: 'true',
        operator: ConditionOperator.Equals,
      };
    }

    return {
      id: createConditionId(),
      leftSide: expressionEncoder(expression.left),
      rightSide: expressionEncoder(expression.right),
      operator,
    };
  }

  if (
    expression.kind === ExpressionKind.CallExpression &&
    expression.callee.kind === ExpressionKind.MemberExpression &&
    expression.callee.property === 'includes'
  ) {
    return {
      id: createConditionId(),
      leftSide: expressionEncoder(expression.callee.object),
      rightSide: expressionEncoder(expression.args[0] ?? createLiteral('')),
      operator: ConditionOperator.Includes,
    };
  }

  return {
    id: createConditionId(),
    leftSide: expressionEncoder(expression),
    rightSide: 'true',
    operator: ConditionOperator.Equals,
  };
};

const expressionToConditionData = (
  expression: Expression,
  expressionEncoder: ExpressionEncoder,
) => {
  const conditions = expressionToCondition(expression, expressionEncoder);

  if (isConditionNode(conditions)) {
    return {
      conditions: {
        id: createId(),
        logicalOperator: LogicalOperator.And,
        children: [conditions],
      } satisfies ConditionGroup,
    };
  }

  return { conditions };
};

const createNodeFromStatement = (
  statement: StatementIR,
  expressionEncoder: ExpressionEncoder,
) => {
  switch (statement.kind) {
    case IRKind.VariableDeclaration:
      if (statement.init && isNamedCall(statement.init, 'input')) {
        return createInputNode(statement);
      }

      return createOperationFromDeclaration(statement, expressionEncoder);

    case IRKind.Assignment:
      return createOperationFromAssignment(statement, expressionEncoder);

    case IRKind.ExpressionStatement:
      if (!isNamedCall(statement.expression, 'output')) {
        throw new Error('Only output(...) expression statements are supported');
      }

      return createOutputNode(statement);

    case IRKind.If:
      return new ConditionalNode(
        undefined,
        undefined,
        expressionToConditionData(statement.test, expressionEncoder),
      );

    default:
      throw new Error('Unsupported statement');
  }
};

const appendStatements = (
  statements: StatementIR[],
  nodes: Map<
    string,
    GraphFromProgramResult['nodes'] extends Map<string, infer T> ? T : never
  >,
  edges: Map<string, Edge>,
  previousId: string,
  targetId: string,
  expressionEncoder: ExpressionEncoder,
): string => {
  let previous = previousId;

  for (const statement of statements) {
    const node = createNodeFromStatement(statement, expressionEncoder);
    console.log({ node });
    nodes.set(node.id, node);

    if (statement.kind === IRKind.If) {
      const thenStart = statement.consequent.length
        ? createNodeFromStatement(statement.consequent[0], expressionEncoder).id
        : targetId;
      const elseStart = statement.alternate?.length
        ? createNodeFromStatement(statement.alternate[0], expressionEncoder).id
        : targetId;

      edges.set(
        node.id,
        BranchEdge.create(node.id, targetId, previous, thenStart, elseStart),
      );

      const actualThenStart = appendStatements(
        statement.consequent,
        nodes,
        edges,
        node.id,
        targetId,
        expressionEncoder,
      );
      const actualElseStart = appendStatements(
        statement.alternate ?? [],
        nodes,
        edges,
        node.id,
        targetId,
        expressionEncoder,
      );

      edges.set(
        node.id,
        BranchEdge.create(
          node.id,
          targetId,
          previous,
          actualThenStart || targetId,
          actualElseStart || targetId,
        ),
      );
    } else {
      edges.set(node.id, Edge.create(node.id, targetId, previous));
    }

    if (previous) {
      const previousEdge = edges.get(previous);

      if (previousEdge) {
        edges.set(previous, previousEdge.withTarget(node.id));
      }
    }

    previous = node.id;
  }

  if (previous) {
    const previousEdge = edges.get(previous);

    if (previousEdge) {
      edges.set(previous, previousEdge.withTarget(targetId));
    }
  }

  return statements.length ? previous : '';
};

export const getGraphFromProgram = (
  program: ProgramIR,
  expressionEncoder: ExpressionEncoder,
): GraphFromProgramResult => {
  const startNode = StartNode.create();
  const endNode = EndNode.create();
  const nodes = new Map<
    string,
    | StartNode
    | EndNode
    | InputNode
    | OperationNode
    | OutputNode
    | ConditionalNode
  >([
    [startNode.id, startNode],
    [endNode.id, endNode],
  ]);
  const edges = new Map<string, Edge>([
    [startNode.id, Edge.create(startNode.id, endNode.id)],
  ]);

  const lastId = appendStatements(
    program.body,
    nodes,
    edges,
    startNode.id,
    endNode.id,
    expressionEncoder,
  );
  const endPrevious = lastId || startNode.id;

  edges.set(endNode.id, Edge.create(endNode.id, '', endPrevious));

  return {
    nodes,
    edges,
    startId: startNode.id,
  };
};
