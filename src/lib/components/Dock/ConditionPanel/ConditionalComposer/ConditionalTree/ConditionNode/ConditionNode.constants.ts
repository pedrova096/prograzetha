import { ConditionOperator } from '~/lib/modules/nodes';

export const CONDITION_OPERATOR_OPTIONS = [
  { label: '==', value: ConditionOperator.Equals },
  { label: '!=', value: ConditionOperator.NotEquals },
  { label: '>', value: ConditionOperator.GreaterThan },
  { label: '>=', value: ConditionOperator.GreaterThanOrEqual },
  { label: '<', value: ConditionOperator.LessThan },
  { label: '<=', value: ConditionOperator.LessThanOrEqual },
  { label: 'incluye', value: ConditionOperator.Includes },
];
