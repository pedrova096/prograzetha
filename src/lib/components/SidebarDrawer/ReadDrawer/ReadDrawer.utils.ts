import * as yup from 'yup';

import { InputType } from '~/lib/modules/nodes/inputNode/inputNode.types';
import { FormFields, type ReadDrawerForm } from './ReadDrawer.types';

export const createReadDrawerData = (
  data?: Partial<ReadDrawerForm>,
): ReadDrawerForm => ({
  [FormFields.Variable]: data?.[FormFields.Variable] ?? '',
  [FormFields.Type]: data?.[FormFields.Type] ?? InputType.String,
});

export const schema = yup.object({
  [FormFields.Variable]: yup.string().trim().required('Campo requerido'),
  [FormFields.Type]: yup
    .mixed<InputType>()
    .oneOf(Object.values(InputType))
    .required('Campo requerido'),
});
