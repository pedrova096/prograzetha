import {
  BinaryOperator,
  LogicalOperatorExpression,
  UnaryOperator,
} from './expression.types';

export const BINARY_OPERATORS: Record<string, BinaryOperator> = {
  '+': BinaryOperator.Add,
  '-': BinaryOperator.Subtract,
  '*': BinaryOperator.Multiply,
  '/': BinaryOperator.Divide,
  '%': BinaryOperator.Modulo,
  '**': BinaryOperator.Power,
  '>': BinaryOperator.GreaterThan,
  '>=': BinaryOperator.GreaterThanOrEqual,
  '<': BinaryOperator.LessThan,
  '<=': BinaryOperator.LessThanOrEqual,
  '==': BinaryOperator.Equals,
  '!=': BinaryOperator.NotEquals,
  '===': BinaryOperator.Equals,
  '!==': BinaryOperator.NotEquals,
};

export const LOGICAL_OPERATORS: Record<string, LogicalOperatorExpression> = {
  '&&': LogicalOperatorExpression.And,
  '||': LogicalOperatorExpression.Or,
};

export const UNARY_OPERATORS: Record<string, UnaryOperator> = {
  '!': UnaryOperator.Not,
  '-': UnaryOperator.Negative,
  '+': UnaryOperator.Positive,
};

export const PRECEDENCE: Record<string, number> = {
  '||': 1,
  '&&': 2,
  '==': 3,
  '!=': 3,
  '===': 3,
  '!==': 3,
  '>': 4,
  '>=': 4,
  '<': 4,
  '<=': 4,
  '+': 5,
  '-': 5,
  '*': 6,
  '/': 6,
  '%': 6,
  '**': 7,
};
