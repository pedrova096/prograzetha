import * as yup from 'yup';

import { VARIABLE_NAME_REGEX } from '~/lib/constants';
import {
  InputType,
  type InputNodeData,
} from '~/lib/modules/nodes/inputNode/inputNode.types';
import { FormFields, type InputForm } from './InputPanel.types';

export const createInputPanelData = (data?: InputNodeData): InputForm => ({
  [FormFields.Name]: data?.[FormFields.Name] ?? '',
  [FormFields.Type]: data?.[FormFields.Type] ?? InputType.String,
});

export const schema = yup.object({
  [FormFields.Name]: yup
    .string()
    .trim()
    .required('Campo requerido')
    .matches(VARIABLE_NAME_REGEX, 'Nombre de variable inválido'),
  [FormFields.Type]: yup
    .mixed<InputType>()
    .oneOf(Object.values(InputType))
    .required('Campo requerido'),
});
