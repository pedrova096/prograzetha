export enum ExpressionKind {
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

export enum ValueType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Null = 'null',
  Unknown = 'unknown',
}

export enum BinaryOperator {
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

export enum LogicalOperatorExpression {
  And = '&&',
  Or = '||',
}

export enum UnaryOperator {
  Not = '!',
  Negative = '-',
  Positive = '+',
}

export type Expression =
  | LiteralExpression
  | IdentifierExpression
  | UnaryExpression
  | BinaryExpression
  | LogicalExpression
  | CallExpression
  | MemberExpression
  | ConditionalExpression
  | ArrayExpression
  | ObjectExpression
  | TemplateLiteralExpression;

export type LiteralExpression = {
  kind: `${ExpressionKind.Literal}`;
  value: string | number | boolean | null;
};

export type IdentifierExpression = {
  kind: `${ExpressionKind.Identifier}`;
  name: string;
};

export type UnaryExpression = {
  kind: `${ExpressionKind.UnaryExpression}`;
  operator: `${UnaryOperator}`;
  argument: Expression;
};

export type BinaryExpression = {
  kind: `${ExpressionKind.BinaryExpression}`;
  operator: `${BinaryOperator}`;
  left: Expression;
  right: Expression;
};

export type LogicalExpression = {
  kind: `${ExpressionKind.LogicalExpression}`;
  operator: `${LogicalOperatorExpression}`;
  left: Expression;
  right: Expression;
};

export type CallExpression = {
  kind: `${ExpressionKind.CallExpression}`;
  callee: Expression;
  args: Expression[];
};

export type MemberExpression = {
  kind: `${ExpressionKind.MemberExpression}`;
  object: Expression;
  property: string;
};

export type ConditionalExpression = {
  kind: `${ExpressionKind.ConditionalExpression}`;
  test: Expression;
  consequent: Expression;
  alternate: Expression;
};

export type ArrayExpression = {
  kind: `${ExpressionKind.ArrayExpression}`;
  elements: Expression[];
};

export type ObjectProperty = {
  key: string;
  value: Expression;
};

export type ObjectExpression = {
  kind: `${ExpressionKind.ObjectExpression}`;
  properties: ObjectProperty[];
};

export type TemplateLiteralExpression = {
  kind: `${ExpressionKind.TemplateLiteral}`;
  parts: Array<string | Expression>;
};
