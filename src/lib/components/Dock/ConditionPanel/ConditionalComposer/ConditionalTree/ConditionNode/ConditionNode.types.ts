import type { ConditionNode } from '~/lib/modules/nodes';

export type ConditionNodeChangedEvent = CustomEvent<{
  value: ConditionNode;
  name: string;
}>;

export type ConditionNodeClassNames = {
  selectField: string;
  inputField: string;
};

export type ConditionNodeProps = {
  classNames?: ConditionNodeClassNames;
  error?: boolean;
  name: string;
  onchange?: (event: ConditionNodeChangedEvent) => void;
  onremove?: VoidFunction;
  readonly?: boolean;
  value?: ConditionNode;
};

export enum FormFields {
  LeftSide = 'leftSide',
  Operator = 'operator',
  RightSide = 'rightSide',
}

export enum InputKind {
  Literal = 'literal',
  Variable = 'variable',
  Invalid = 'invalid',
}

export enum InputLiteralKind {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Null = 'null',
}
