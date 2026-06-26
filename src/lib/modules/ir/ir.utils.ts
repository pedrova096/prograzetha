import jsep from 'jsep';

import {
  ConditionOperator,
  isConditionGroup,
  LogicalOperator,
  type ConditionNode,
  type ConditionUnion,
} from '../nodes';
import {
  BinaryOperatorIR,
  IRKind,
  LogicalOperatorIR,
  UnaryOperatorIR,
  type ExpressionIR,
  type PatternIR,
} from './ir.types';

const BINARY_OPERATORS: Record<string, BinaryOperatorIR> = {
  '==': BinaryOperatorIR.Equals,
  '!=': BinaryOperatorIR.NotEquals,
  '>': BinaryOperatorIR.GreaterThan,
  '>=': BinaryOperatorIR.GreaterThanOrEqual,
  '<': BinaryOperatorIR.LessThan,
  '<=': BinaryOperatorIR.LessThanOrEqual,
  '+': BinaryOperatorIR.Add,
  '-': BinaryOperatorIR.Subtract,
  '*': BinaryOperatorIR.Multiply,
  '/': BinaryOperatorIR.Divide,
  '%': BinaryOperatorIR.Modulo,
  '**': BinaryOperatorIR.Power,
};

const LOGICAL_OPERATORS: Record<string, LogicalOperatorIR> = {
  '&&': LogicalOperatorIR.And,
  '||': LogicalOperatorIR.Or,
  [LogicalOperator.And]: LogicalOperatorIR.And,
  [LogicalOperator.Or]: LogicalOperatorIR.Or,
};

const UNARY_OPERATORS: Record<string, UnaryOperatorIR> = {
  '!': UnaryOperatorIR.Not,
  '-': UnaryOperatorIR.Negative,
  '+': UnaryOperatorIR.Positive,
};

export const createIdentifier = (name: string): ExpressionIR => ({
  kind: IRKind.Identifier,
  name,
});

export const createIdentifierPattern = (name: string): PatternIR => ({
  kind: IRKind.IdentifierPattern,
  name,
});

export const createLiteral = (
  value: string | number | boolean | null,
): ExpressionIR => ({
  kind: IRKind.Literal,
  value,
});

const getMemberPropertyName = (property: jsep.Expression): string => {
  if (property.type === 'Identifier') {
    return (property as jsep.Identifier).name;
  }

  if (property.type === 'Literal') {
    return String((property as jsep.Literal).value);
  }

  return 'unknown';
};

export const createExpression = (
  expression: jsep.Expression | null,
): ExpressionIR => {
  if (!expression) {
    return createLiteral(null);
  }

  switch (expression.type) {
    case 'Literal': {
      const { value } = expression as jsep.Literal;

      if (
        value === null ||
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        return createLiteral(value);
      }

      return createLiteral(String(value));
    }

    case 'Identifier':
      return createIdentifier((expression as jsep.Identifier).name);

    case 'UnaryExpression': {
      const unary = expression as jsep.UnaryExpression;

      return {
        kind: IRKind.UnaryExpression,
        operator: UNARY_OPERATORS[unary.operator] ?? UnaryOperatorIR.Not,
        argument: createExpression(unary.argument),
      };
    }

    case 'BinaryExpression': {
      const binary = expression as jsep.BinaryExpression;

      if (binary.operator in LOGICAL_OPERATORS) {
        return {
          kind: IRKind.LogicalExpression,
          operator: LOGICAL_OPERATORS[binary.operator],
          left: createExpression(binary.left),
          right: createExpression(binary.right),
        };
      }

      return {
        kind: IRKind.BinaryExpression,
        operator: BINARY_OPERATORS[binary.operator] ?? BinaryOperatorIR.Equals,
        left: createExpression(binary.left),
        right: createExpression(binary.right),
      };
    }

    case 'CallExpression': {
      const call = expression as jsep.CallExpression;

      return {
        kind: IRKind.CallExpression,
        callee: createExpression(call.callee),
        args: call.arguments.map(createExpression),
      };
    }

    case 'MemberExpression': {
      const member = expression as jsep.MemberExpression;

      return {
        kind: IRKind.MemberExpression,
        object: createExpression(member.object),
        property: getMemberPropertyName(member.property),
      };
    }

    default:
      return createLiteral(null);
  }
};

const createConditionNodeExpression = (
  condition: ConditionNode,
): ExpressionIR => {
  const left = createExpression(jsep(condition.leftSide));
  const right = createExpression(jsep(condition.rightSide));

  if (condition.operator === ConditionOperator.Includes) {
    return {
      kind: IRKind.CallExpression,
      callee: {
        kind: IRKind.MemberExpression,
        object: left,
        property: 'includes',
      },
      args: [right],
    };
  }

  return {
    kind: IRKind.BinaryExpression,
    operator: BINARY_OPERATORS[condition.operator] ?? BinaryOperatorIR.Equals,
    left,
    right,
  };
};

export const createConditionExpression = (
  condition: ConditionUnion,
): ExpressionIR => {
  if (!isConditionGroup(condition)) {
    return createConditionNodeExpression(condition);
  }

  const [first, ...rest] = condition.children.map(createConditionExpression);

  if (!first) {
    return createLiteral(true);
  }

  return rest.reduce<ExpressionIR>((expression, child) => {
    return {
      kind: IRKind.LogicalExpression,
      operator: LOGICAL_OPERATORS[condition.logicalOperator],
      left: expression,
      right: child,
    };
  }, first);
};
