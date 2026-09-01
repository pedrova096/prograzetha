import type { ConditionUnion, WhileLoopNode } from '~/lib/modules/nodes';
import type { FormNodePanel } from '../Panel.types';

export enum FormFields {
  Conditions = 'conditions',
}

export type WhileLoopForm = {
  [FormFields.Conditions]: ConditionUnion;
};

export type WhileLoopPanelProps = FormNodePanel<WhileLoopNode>;
