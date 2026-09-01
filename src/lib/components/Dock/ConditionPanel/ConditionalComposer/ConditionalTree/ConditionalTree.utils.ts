import { createId } from '@paralleldrive/cuid2';
import {
  ConditionOperator,
  LogicalOperator,
  type ConditionNode,
  type ConditionGroup,
} from '~/lib/modules/nodes';

export const createCondition = (): ConditionNode => ({
  id: createId(),
  leftSide: '',
  rightSide: '',
  operator: ConditionOperator.Equals,
});

export const createConditionGroup = (): ConditionGroup => ({
  id: createId(),
  logicalOperator: LogicalOperator.And,
  children: [createCondition()],
});
