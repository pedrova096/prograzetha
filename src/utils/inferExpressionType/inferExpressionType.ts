import type {
  BinaryExpression,
  CallExpression,
  Expression,
  Identifier,
  Literal,
  LogicalExpression,
  MemberExpression,
  UnaryExpression,
} from 'estree';

import type { TypeScope } from './inferExpressionType.types';
import { InferredType } from './inferExpressionType.types';
import { MATH_NUMBER_RETURNING_METHODS } from './inferExpressionType.constants';

export function inferExpressionType(
  node: Expression,
  scope: TypeScope = {},
): InferredType {
  switch (node.type) {
    case 'Literal':
      return inferLiteralType(node);

    case 'Identifier':
      return inferIdentifierType(node, scope);

    case 'ArrayExpression':
      return InferredType.Array;

    case 'ObjectExpression':
      return InferredType.Object;

    case 'UnaryExpression':
      return inferUnaryType(node);

    case 'BinaryExpression':
      return inferBinaryType(node, scope);

    case 'LogicalExpression':
      return inferLogicalType(node, scope);

    case 'ConditionalExpression':
      return mergeTypes(
        inferExpressionType(node.consequent, scope),
        inferExpressionType(node.alternate, scope),
      );

    case 'CallExpression':
      return inferCallType(node);

    default:
      return InferredType.Unknown;
  }
}

function inferLiteralType(node: Literal): InferredType {
  if (node.value === null) {
    return InferredType.Null;
  }

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

function inferIdentifierType(node: Identifier, scope: TypeScope): InferredType {
  return (scope[node.name] as InferredType) ?? InferredType.Unknown;
}

function inferUnaryType(node: UnaryExpression): InferredType {
  switch (node.operator) {
    case '!':
    case 'delete':
      return InferredType.Boolean;

    case '+':
    case '-':
    case '~':
      return InferredType.Number;

    case 'typeof':
      return InferredType.String;

    case 'void':
      return InferredType.Unknown;

    default:
      return InferredType.Unknown;
  }
}

function inferBinaryType(
  node: BinaryExpression,
  scope: TypeScope,
): InferredType {
  switch (node.operator) {
    case '==':
    case '!=':
    case '===':
    case '!==':
    case '<':
    case '<=':
    case '>':
    case '>=':
    case 'in':
    case 'instanceof':
      return InferredType.Boolean;

    case '-':
    case '*':
    case '/':
    case '%':
    case '**':
    case '|':
    case '&':
    case '^':
    case '<<':
    case '>>':
    case '>>>':
      return InferredType.Number;

    case '+':
      return inferPlusType(
        node.left as Expression,
        node.right as Expression,
        scope,
      );

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
  return mergeTypes(
    inferExpressionType(node.left as Expression, scope),
    inferExpressionType(node.right as Expression, scope),
  );
}

function inferCallType(node: CallExpression): InferredType {
  const callee = node.callee;

  if (callee.type !== 'MemberExpression') {
    return InferredType.Unknown;
  }

  const method = getMathMethodName(callee);

  if (!method) {
    return InferredType.Unknown;
  }

  if (MATH_NUMBER_RETURNING_METHODS.has(method)) {
    return InferredType.Number;
  }

  return InferredType.Unknown;
}

function getMathMethodName(node: MemberExpression): string | null {
  if (node.object.type !== 'Identifier') {
    return null;
  }

  if (node.object.name !== 'Math') {
    return null;
  }

  if (node.computed) {
    if (node.property.type === 'Literal') {
      return String(node.property.value);
    }

    return null;
  }

  if (node.property.type === 'Identifier') {
    return node.property.name;
  }

  return null;
}

function mergeTypes(a: InferredType, b: InferredType): InferredType {
  if (a === b) {
    return a;
  }

  return InferredType.Unknown;
}
