import {
  createDefaultConditionalData,
  type WhileLoopNode,
  type WhileLoopNodeData,
} from '~/lib/modules/nodes';
import { normalizeConditions } from '../ConditionalDrawer/ConditionalDrawer.utils';
import {
  FormFields,
  type WhileLoopDrawerForm,
} from './WhileLoopDrawer.types';

export const createWhileLoopDrawerData = (
  node?: WhileLoopNode | null,
): WhileLoopDrawerForm => ({
  [FormFields.Conditions]:
    node?.data.conditions ?? createDefaultConditionalData().conditions,
});

export const createWhileLoopNodeData = (
  form: WhileLoopDrawerForm,
): WhileLoopNodeData => ({
  conditions: normalizeConditions(form[FormFields.Conditions]),
});
