import type { ConditionUnion } from '~/lib/modules/nodes';

export type ConditionalTreeProps = {
  path?: string;
  value: ConditionUnion;
  onremove?: () => void;
};

export enum FormFields {
  LogicalOperator = 'logicalOperator',
}
