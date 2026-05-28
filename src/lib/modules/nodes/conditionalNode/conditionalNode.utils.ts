import { createId } from '@paralleldrive/cuid2';
import {
  ConditionOperator,
  LogicalOperator,
  type ConditionalNodeData,
  type ConditionUnion,
  type ConditionGroup,
  type ConditionNode,
} from './conditionalNode.types';

export const createDefaultConditionalData = (): ConditionalNodeData => ({
  conditions: {
    id: createId(),
    logicalOperator: LogicalOperator.And,
    children: [
      {
        id: createId(),
        leftSide: '',
        rightSide: '',
        operator: ConditionOperator.Equals,
      },
    ],
  },
});

export const isConditionGroup = (
  condition: ConditionUnion,
): condition is ConditionGroup => 'children' in condition;

export const isConditionNode = (
  condition: ConditionUnion,
): condition is ConditionNode => !isConditionGroup(condition);
