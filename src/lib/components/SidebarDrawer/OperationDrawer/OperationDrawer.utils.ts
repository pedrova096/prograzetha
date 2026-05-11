import jsep from 'jsep';
import * as yup from 'yup';

import {
  FormFields,
  type GetVariablesUntilOptions,
  type OperationDrawerForm,
} from './OperationDrawer.types';
import { InputNode, type Node } from '~/lib/modules/nodes';

export const createOperationDrawerData = (
  data?: Partial<OperationDrawerForm>,
): OperationDrawerForm => ({
  [FormFields.LeftSide]: data?.[FormFields.LeftSide] ?? '',
  [FormFields.RightSide]: data?.[FormFields.RightSide] ?? '',
  [FormFields.Tree]: data?.[FormFields.Tree] ?? null,
  isNewVariable: data?.isNewVariable ?? false,
});

const mapJsepError = (error: Error) => {
  if (error.message.includes('Unexpected')) {
    let char = error.message.split('Unexpected ')[1];
    char = char.slice(0, char.lastIndexOf('"') + 1);
    return `Carácter inesperado ${char}`;
  }

  if (error.message.includes('missing unaryOp argument')) {
    return 'Falta argumento para la operación'; // example: + 1
  }

  if (error.message.includes('Unclosed [')) {
    return 'Corchetes sin cerrar'; // example: [1 + 2
  }

  if (error.message.includes('Expected exponent')) {
    return 'Se esperaba un exponente'; // example: 1e
  }

  if (error.message.includes('Variable names cannot start with a number')) {
    return 'Las variables no pueden empezar con un número'; // example: 1var
  }

  if (error.message.includes('Unexpected period')) {
    return 'Punto inesperado'; // example: 1.2.
  }

  if (error.message.includes('Unclosed quote')) {
    return 'Comillas sin cerrar'; // example: "string
  }

  if (error.message.includes('Unexpected token')) {
    return 'Símbolo inesperado'; // example: 1 + #
  }

  if (error.message.includes('Expected comma')) {
    return 'Se esperaba una coma'; // example: [1 2]
  }

  if (error.message.includes('Expected')) {
    // return "TODO";
  }

  if (error.message.includes('Unclosed (')) {
    return 'Paréntesis sin cerrar'; // example: (1 + 2
  }

  if (error.message.includes('Expected expression')) {
    // return "TODO"; // example: +
  }

  if (error.message.includes('Expected :')) {
    return "Se esperaba un ':'"; // example: {a 1}
  }

  return 'Error en la expresión';
};

export const schema = yup.object({
  [FormFields.LeftSide]: yup
    .string()
    .required('Campo requerido')
    .matches(/^[^\s]+$/, 'No se permiten espacios'),
  [FormFields.RightSide]: yup
    .string()
    .required('Campo requerido')
    .test('jsep-error', 'Expresión inválida', (value) => {
      try {
        const parsed = jsep(value);
        if (parsed.type === 'Compound') {
          throw new yup.ValidationError(
            'Expresión inválida',
            value,
            FormFields.RightSide,
          );
        }
        return true;
      } catch (error) {
        throw new yup.ValidationError(
          mapJsepError(error as Error),
          value,
          FormFields.RightSide,
        );
      }
    }),
  [FormFields.Tree]: yup.object().nonNullable().required('Campo requerido'),
});

type IsVariableFromListOptions = {
  list: Array<{ name: string }>;
  hasError: boolean;
  isTouched: boolean;
};

export const isVariableFromList = (
  options: IsVariableFromListOptions,
  value: string,
) => {
  if (!value) {
    return null;
  }

  const { hasError, isTouched, list } = options;

  if (hasError) {
    return null;
  }

  if (!isTouched) {
    return null;
  }

  return list.some((variable) => variable.name === value);
};

export const getPreviousVariables = (
  options: GetVariablesUntilOptions,
  node: Node | null,
) => {
  const variables: { name: string }[] = [];

  if (!node) return variables;

  let currentId: string | undefined = node.id;

  while (currentId) {
    const node = options.nodes.get(currentId);
    const edge = options.edges.get(currentId);

    if (node instanceof InputNode && node.data.variable) {
      variables.push({ name: node.data.variable });
    }

    currentId = edge?.previous;
  }

  return variables;
};
