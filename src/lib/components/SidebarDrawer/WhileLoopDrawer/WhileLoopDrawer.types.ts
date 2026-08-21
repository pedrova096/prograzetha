import type { ConditionUnion, WhileLoopNode } from '~/lib/modules/nodes';
import type { FormNodeDrawer } from '../SidebarDrawer.types';

export enum FormFields {
  Conditions = 'conditions',
}

export type WhileLoopDrawerForm = {
  [FormFields.Conditions]: ConditionUnion;
};

export interface WhileLoopDrawerProps extends FormNodeDrawer<WhileLoopNode> {}
