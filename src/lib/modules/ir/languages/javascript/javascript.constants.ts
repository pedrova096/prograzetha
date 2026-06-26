import {
  BinaryOperatorIR,
  LogicalOperatorIR,
  UnaryOperatorIR,
} from '../../ir.types';

export const OPERATORS = [
  '===',
  '!==',
  '>=',
  '<=',
  '==',
  '!=',
  '&&',
  '||',
  '**',
  '+',
  '-',
  '*',
  '/',
  '%',
  '>',
  '<',
  '!',
  '=',
];

export const BINARY_OPERATORS: Record<string, BinaryOperatorIR> = {
  '+': BinaryOperatorIR.Add,
  '-': BinaryOperatorIR.Subtract,
  '*': BinaryOperatorIR.Multiply,
  '/': BinaryOperatorIR.Divide,
  '%': BinaryOperatorIR.Modulo,
  '**': BinaryOperatorIR.Power,
  '>': BinaryOperatorIR.GreaterThan,
  '>=': BinaryOperatorIR.GreaterThanOrEqual,
  '<': BinaryOperatorIR.LessThan,
  '<=': BinaryOperatorIR.LessThanOrEqual,
  '==': BinaryOperatorIR.Equals,
  '!=': BinaryOperatorIR.NotEquals,
  '===': BinaryOperatorIR.Equals,
  '!==': BinaryOperatorIR.NotEquals,
};

export const LOGICAL_OPERATORS: Record<string, LogicalOperatorIR> = {
  '&&': LogicalOperatorIR.And,
  '||': LogicalOperatorIR.Or,
};

export const UNARY_OPERATORS: Record<string, UnaryOperatorIR> = {
  '!': UnaryOperatorIR.Not,
  '-': UnaryOperatorIR.Negative,
  '+': UnaryOperatorIR.Positive,
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
