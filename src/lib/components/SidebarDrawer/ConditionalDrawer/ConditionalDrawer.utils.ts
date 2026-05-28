import { createId } from '@paralleldrive/cuid2';

import {
  ConditionOperator,
  createDefaultConditionalData,
  LogicalOperator,
  type ConditionUnion,
} from '~/lib/modules/nodes';
import {
  FormFields,
  type ConditionalDrawerForm,
} from './ConditionalDrawer.types';

export const createConditionDrawerData = (
  data?: Partial<ConditionalDrawerForm>,
): ConditionalDrawerForm => ({
  [FormFields.Conditions]:
    data?.[FormFields.Conditions] ?? createDefaultConditionalData().conditions,
});

export const normalizeConditions = (
  condition: ConditionUnion,
): ConditionUnion => {
  if (!('logicalOperator' in condition)) return { ...condition };

  return {
    ...condition,
    children: condition.children.map(normalizeConditions),
  };
};
