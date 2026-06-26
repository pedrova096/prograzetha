import type { Edge } from '~/lib/modules/edge';
import type { Node } from '~/lib/modules/nodes';

export enum IRKind {
  Program = 'Program',
  VariableDeclaration = 'VariableDeclaration',
  Assignment = 'Assignment',
  ExpressionStatement = 'ExpressionStatement',
  If = 'If',
  IdentifierPattern = 'IdentifierPattern',
  Literal = 'Literal',
  Identifier = 'Identifier',
  UnaryExpression = 'UnaryExpression',
  BinaryExpression = 'BinaryExpression',
  LogicalExpression = 'LogicalExpression',
  CallExpression = 'CallExpression',
  MemberExpression = 'MemberExpression',
  ConditionalExpression = 'ConditionalExpression',
  ArrayExpression = 'ArrayExpression',
  ObjectExpression = 'ObjectExpression',
  TemplateLiteral = 'TemplateLiteral',
}

export enum ValueTypeIR {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Null = 'null',
  Unknown = 'unknown',
}

export enum BinaryOperatorIR {
  Equals = '==',
  NotEquals = '!=',
  GreaterThan = '>',
  GreaterThanOrEqual = '>=',
  LessThan = '<',
  LessThanOrEqual = '<=',
  Add = '+',
  Subtract = '-',
  Multiply = '*',
  Divide = '/',
  Modulo = '%',
  Power = '**',
}

export enum LogicalOperatorIR {
  And = '&&',
  Or = '||',
}

export enum UnaryOperatorIR {
  Not = '!',
  Negative = '-',
  Positive = '+',
}

export type ProgramIR = {
  kind: `${IRKind.Program}`;
  body: StatementIR[];
};

export type StatementIR =
  | VariableDeclarationIR
  | AssignmentIR
  | ExpressionStatementIR
  | IfIR;

export type VariableDeclarationIR = {
  kind: `${IRKind.VariableDeclaration}`;
  name: string;
  valueType?: `${ValueTypeIR}`;
  init?: ExpressionIR;
};

export type AssignmentIR = {
  kind: `${IRKind.Assignment}`;
  target: PatternIR;
  value: ExpressionIR;
};

export type ExpressionStatementIR = {
  kind: `${IRKind.ExpressionStatement}`;
  expression: ExpressionIR;
};

export type IfIR = {
  kind: `${IRKind.If}`;
  test: ExpressionIR;
  consequent: StatementIR[];
  alternate?: StatementIR[];
};

export type PatternIR = {
  kind: `${IRKind.IdentifierPattern}`;
  name: string;
};

export type ExpressionIR =
  | LiteralIR
  | IdentifierIR
  | UnaryExpressionIR
  | BinaryExpressionIR
  | LogicalExpressionIR
  | CallExpressionIR
  | MemberExpressionIR
  | ConditionalExpressionIR
  | ArrayExpressionIR
  | ObjectExpressionIR
  | TemplateLiteralIR;

export type LiteralIR = {
  kind: `${IRKind.Literal}`;
  value: string | number | boolean | null;
};

export type IdentifierIR = {
  kind: `${IRKind.Identifier}`;
  name: string;
};

export type UnaryExpressionIR = {
  kind: `${IRKind.UnaryExpression}`;
  operator: `${UnaryOperatorIR}`;
  argument: ExpressionIR;
};

export type BinaryExpressionIR = {
  kind: `${IRKind.BinaryExpression}`;
  operator: `${BinaryOperatorIR}`;
  left: ExpressionIR;
  right: ExpressionIR;
};

export type LogicalExpressionIR = {
  kind: `${IRKind.LogicalExpression}`;
  operator: `${LogicalOperatorIR}`;
  left: ExpressionIR;
  right: ExpressionIR;
};

export type CallExpressionIR = {
  kind: `${IRKind.CallExpression}`;
  callee: ExpressionIR;
  args: ExpressionIR[];
};

export type MemberExpressionIR = {
  kind: `${IRKind.MemberExpression}`;
  object: ExpressionIR;
  property: string;
};

export type ConditionalExpressionIR = {
  kind: `${IRKind.ConditionalExpression}`;
  test: ExpressionIR;
  consequent: ExpressionIR;
  alternate: ExpressionIR;
};

export type ArrayExpressionIR = {
  kind: `${IRKind.ArrayExpression}`;
  elements: ExpressionIR[];
};

export type ObjectPropertyIR = {
  key: string;
  value: ExpressionIR;
};

export type ObjectExpressionIR = {
  kind: `${IRKind.ObjectExpression}`;
  properties: ObjectPropertyIR[];
};

export type TemplateLiteralIR = {
  kind: `${IRKind.TemplateLiteral}`;
  parts: Array<string | ExpressionIR>;
};

export type NodeIR = ProgramIR | StatementIR | ExpressionIR | PatternIR;

export type GetIROptions = {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
};

export type GetASTOptions = GetIROptions;
