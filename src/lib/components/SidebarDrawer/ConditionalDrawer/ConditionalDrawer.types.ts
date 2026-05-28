import type { ConditionalNode } from '~/lib/modules/nodes';
import type { ConditionUnion } from '~/lib/modules/nodes';

export enum FormFields {
  Conditions = 'conditions',
}

export type ConditionalDrawerForm = {
  [FormFields.Conditions]: ConditionUnion;
};

export type ConditionalDrawerProps = {
  node: ConditionalNode | null;
  onSave: (node: ConditionalNode) => void;
  onClose?: () => void;
};
