import type { ConditionalNode } from '~/lib/modules/nodes';
import type { ConditionUnion } from '~/lib/modules/nodes';
import type { FormNodeDrawer } from '../SidebarDrawer.types';

export enum FormFields {
  Conditions = 'conditions',
}

export type ConditionalDrawerForm = {
  [FormFields.Conditions]: ConditionUnion;
};

export interface ConditionalDrawerProps
  extends FormNodeDrawer<ConditionalNode> {}
