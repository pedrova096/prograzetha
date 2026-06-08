import * as yup from 'yup';

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

const conditionNodeSchema = yup.object({
  id: yup.string().required(),
  leftSide: yup.string().required('Campo requerido'),
  operator: yup
    .mixed<ConditionOperator>()
    .oneOf(Object.values(ConditionOperator))
    .required('Campo requerido'),
  rightSide: yup.string().required('Campo requerido'),
}).required('Campo requerido');

const createConditionSchema = (isRoot = false): yup.Lazy<ConditionUnion> =>
  yup.lazy((condition) => {
    if (!condition || typeof condition !== 'object') {
      return conditionNodeSchema;
    }

    if ('children' in condition) {
      return yup
        .object({
          id: yup.string().required(),
          logicalOperator: yup
            .mixed<LogicalOperator>()
            .oneOf(Object.values(LogicalOperator))
            .required('Campo requerido'),
          children: yup
            .array()
            .of(createConditionSchema(false))
            .min(isRoot ? 1 : 2, 'El grupo debe tener al menos 2 condiciones')
            .required('Campo requerido'),
        })
        .required('Campo requerido');
    }

    return conditionNodeSchema;
  });

export const schema = yup.object({
  [FormFields.Conditions]: createConditionSchema(true),
});
