import * as yup from 'yup';

import { VARIABLE_NAME_REGEX } from '~/lib/constants';
import type { ForLoopNode, ForLoopNodeData } from '~/lib/modules/nodes';
import { FormFields, type ForLoopDrawerForm } from './ForLoopDrawer.types';

export const createForLoopDrawerData = (
  node?: ForLoopNode | null,
): ForLoopDrawerForm => ({
  [FormFields.Iterator]: node?.data.iterator ?? 'i',
  [FormFields.Start]: node?.data.start ?? 0,
  [FormFields.End]: node?.data.end ?? 10,
  [FormFields.Step]: node?.data.step ?? 1,
});

export const createForLoopNodeData = (
  form: ForLoopDrawerForm,
): ForLoopNodeData => ({
  iterator: form[FormFields.Iterator].trim(),
  start: form[FormFields.Start],
  end: form[FormFields.End],
  step: form[FormFields.Step],
});

const requiredString = () => yup.string().trim().required('Campo requerido');
const requiredNumber = () =>
  yup.number().typeError('Ingresa un número').required('Campo requerido');

export const schema = yup.object({
  [FormFields.Iterator]: requiredString().matches(
    VARIABLE_NAME_REGEX,
    'Nombre de variable inválido',
  ),
  [FormFields.Start]: requiredNumber(),
  [FormFields.End]: requiredNumber(),
  [FormFields.Step]: requiredNumber()
    .integer('Usa un entero distinto de cero')
    .notOneOf([0], 'Usa un entero distinto de cero'),
});
