import {
  BinaryOperator,
  LogicalOperatorExpression,
  UnaryOperator,
} from '~/lib/modules/expression';

export const INDENT = '    ';

export const BINARY_OPERATORS = {
  [BinaryOperator.Equals]: '==',
  [BinaryOperator.NotEquals]: '!=',
  [BinaryOperator.GreaterThan]: '>',
  [BinaryOperator.GreaterThanOrEqual]: '>=',
  [BinaryOperator.LessThan]: '<',
  [BinaryOperator.LessThanOrEqual]: '<=',
  [BinaryOperator.Add]: '+',
  [BinaryOperator.Subtract]: '-',
  [BinaryOperator.Multiply]: '*',
  [BinaryOperator.Divide]: '/',
  [BinaryOperator.Modulo]: '%',
  [BinaryOperator.Power]: '**',
} as const satisfies Record<BinaryOperator, string>;

export const LOGICAL_OPERATORS = {
  [LogicalOperatorExpression.And]: 'and',
  [LogicalOperatorExpression.Or]: 'or',
} as const satisfies Record<LogicalOperatorExpression, string>;

export const UNARY_OPERATORS = {
  [UnaryOperator.Not]: 'not ',
  [UnaryOperator.Negative]: '-',
  [UnaryOperator.Positive]: '+',
} as const satisfies Record<UnaryOperator, string>;
