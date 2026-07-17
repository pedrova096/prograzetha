import {
  BinaryOperator,
  ExpressionKind,
  LogicalOperatorExpression,
  UnaryOperator,
  type BinaryExpression,
  type CallExpression,
  type Expression,
  type IdentifierExpression,
  type LiteralExpression,
  type LogicalExpression,
  type MemberExpression,
  type UnaryExpression,
} from '~/lib/modules/expression';

import { MATH_NUMBER_RETURNING_METHODS } from './inferExpressionType.constants';
import { InferredType, type TypeScope } from './inferExpressionType.types';

export function inferExpressionType(
  node: Expression,
  scope: TypeScope = {},
): InferredType {
  switch (node.kind) {
    case ExpressionKind.Literal:
      return inferLiteralType(node);
    case ExpressionKind.Identifier:
      return inferIdentifierType(node, scope);
    case ExpressionKind.ArrayExpression:
      return InferredType.Array;
    case ExpressionKind.ObjectExpression:
      return InferredType.Object;
    case ExpressionKind.TemplateLiteral:
      return InferredType.String;
    case ExpressionKind.UnaryExpression:
      return inferUnaryType(node);
    case ExpressionKind.BinaryExpression:
      return inferBinaryType(node, scope);
    case ExpressionKind.LogicalExpression:
      return inferLogicalType(node, scope);
    case ExpressionKind.ConditionalExpression:
      return mergeTypes(
        inferExpressionType(node.consequent, scope),
        inferExpressionType(node.alternate, scope),
      );
    case ExpressionKind.CallExpression:
      return inferCallType(node);
    case ExpressionKind.MemberExpression:
      return InferredType.Unknown;
    default:
      return InferredType.Unknown;
  }
}

function inferLiteralType(node: LiteralExpression): InferredType {
  if (node.value === null) return InferredType.Null;

  switch (typeof node.value) {
    case 'string':
      return InferredType.String;
    case 'number':
      return InferredType.Number;
    case 'boolean':
      return InferredType.Boolean;
    default:
      return InferredType.Unknown;
  }
}

function inferIdentifierType(
  node: IdentifierExpression,
  scope: TypeScope,
): InferredType {
  return (scope[node.name] as InferredType) ?? InferredType.Unknown;
}

function inferUnaryType(node: UnaryExpression): InferredType {
  switch (node.operator) {
    case UnaryOperator.Not:
      return InferredType.Boolean;
    case UnaryOperator.Positive:
    case UnaryOperator.Negative:
      return InferredType.Number;
    default:
      return InferredType.Unknown;
  }
}

function inferBinaryType(
  node: BinaryExpression,
  scope: TypeScope,
): InferredType {
  switch (node.operator) {
    case BinaryOperator.Equals:
    case BinaryOperator.NotEquals:
    case BinaryOperator.GreaterThan:
    case BinaryOperator.GreaterThanOrEqual:
    case BinaryOperator.LessThan:
    case BinaryOperator.LessThanOrEqual:
      return InferredType.Boolean;
    case BinaryOperator.Subtract:
    case BinaryOperator.Multiply:
    case BinaryOperator.Divide:
    case BinaryOperator.Modulo:
    case BinaryOperator.Power:
      return InferredType.Number;
    case BinaryOperator.Add:
      return inferPlusType(node.left, node.right, scope);
    default:
      return InferredType.Unknown;
  }
}

function inferPlusType(
  leftNode: Expression,
  rightNode: Expression,
  scope: TypeScope,
): InferredType {
  const left = inferExpressionType(leftNode, scope);
  const right = inferExpressionType(rightNode, scope);

  if (left === InferredType.String || right === InferredType.String) {
    return InferredType.String;
  }

  if (left === InferredType.Number && right === InferredType.Number) {
    return InferredType.Number;
  }

  return InferredType.Unknown;
}

function inferLogicalType(
  node: LogicalExpression,
  scope: TypeScope,
): InferredType {
  if (
    node.operator === LogicalOperatorExpression.And ||
    node.operator === LogicalOperatorExpression.Or
  ) {
    return InferredType.Boolean;
  }

  return mergeTypes(
    inferExpressionType(node.left, scope),
    inferExpressionType(node.right, scope),
  );
}

function inferCallType(node: CallExpression): InferredType {
  if (
    node.callee.kind === ExpressionKind.Identifier &&
    node.callee.name === 'input'
  ) {
    return InferredType.String;
  }

  if (node.callee.kind !== ExpressionKind.MemberExpression) {
    return InferredType.Unknown;
  }

  const method = getMathMethodName(node.callee);

  if (method && MATH_NUMBER_RETURNING_METHODS.has(method)) {
    return InferredType.Number;
  }

  return InferredType.Unknown;
}

function getMathMethodName(node: MemberExpression): string | null {
  if (
    node.object.kind !== ExpressionKind.Identifier ||
    node.object.name !== 'Math'
  ) {
    return null;
  }

  return node.property;
}

function mergeTypes(a: InferredType, b: InferredType): InferredType {
  return a === b ? a : InferredType.Unknown;
}
