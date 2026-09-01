import type { ConditionalNode } from '~/lib/modules/nodes';
import type { ConditionUnion } from '~/lib/modules/nodes';
import type { FormNodePanel } from '../Panel.types';

export enum FormFields {
  Conditions = 'conditions',
}

export type ConditionForm = {
  [FormFields.Conditions]: ConditionUnion;
};

export type ConditionPanelProps = FormNodePanel<ConditionalNode>;
