import type { Edge } from '~/lib/modules/edge';
import type { Expression } from '~/lib/modules/expression';
import type { Node } from '~/lib/modules/nodes';

export enum IRKind {
  Program = 'Program',
  VariableDeclaration = 'VariableDeclaration',
  Assignment = 'Assignment',
  ExpressionStatement = 'ExpressionStatement',
  If = 'If',
  IdentifierPattern = 'IdentifierPattern',
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
  valueType?: string;
  init?: Expression;
};

export type AssignmentIR = {
  kind: `${IRKind.Assignment}`;
  target: PatternIR;
  value: Expression;
};

export type ExpressionStatementIR = {
  kind: `${IRKind.ExpressionStatement}`;
  expression: Expression;
};

export type IfIR = {
  kind: `${IRKind.If}`;
  test: Expression;
  consequent: StatementIR[];
  alternate?: StatementIR[];
};

export type PatternIR = {
  kind: `${IRKind.IdentifierPattern}`;
  name: string;
};

export type GetIROptions = {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
};

export type GraphFromProgramResult = GetIROptions & {
  startId: string;
};
