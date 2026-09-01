import {
  createDefaultConditionalData,
  type WhileLoopNode,
  type WhileLoopNodeData,
} from '~/lib/modules/nodes';
import { normalizeConditions } from '../ConditionPanel/ConditionPanel.utils';
import { FormFields, type WhileLoopForm } from './WhileLoopPanel.types';

export const createWhileLoopPanelData = (
  node?: WhileLoopNode | null,
): WhileLoopForm => ({
  [FormFields.Conditions]:
    node?.data.conditions ?? createDefaultConditionalData().conditions,
});

export const createWhileLoopNodeData = (
  form: WhileLoopForm,
): WhileLoopNodeData => ({
  conditions: normalizeConditions(form[FormFields.Conditions]),
});
