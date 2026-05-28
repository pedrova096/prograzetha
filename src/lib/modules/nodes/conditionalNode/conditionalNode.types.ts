export enum LogicalOperator {
  And = 'and',
  Or = 'or',
}

export enum ConditionOperator {
  Equals = '==',
  NotEquals = '!=',
  GreaterThan = '>',
  GreaterThanOrEqual = '>=',
  LessThan = '<',
  LessThanOrEqual = '<=',
  Includes = 'includes',
}

export type ConditionNode = {
  id: string;
  leftSide: string;
  rightSide: string;
  operator: ConditionOperator;
};

export type ConditionElement = {
  id: string;
  width: number;
  height: number;
  children?: ConditionElement[];
};

export type ConditionGroup = {
  id: string;
  logicalOperator: LogicalOperator;
  children: ConditionUnion[];
};

export type ConditionUnion = ConditionGroup | ConditionNode;

export type ConditionalNodeData = {
  conditions: ConditionUnion;
};
