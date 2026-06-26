import jsep from 'jsep';
import * as yup from 'yup';
import type { Expression } from 'estree';

import {
  FormFields,
  type CreateOperationDrawerSchemaOptions,
  type GetVariablesUntilOptions,
  type IsVariableFromListOptions,
  type OperationDrawerForm,
} from './OperationDrawer.types';
import { LiteralVariants, VARIABLE_NAME_REGEX } from '~/lib/constants';
import {
  InputNode,
  OperationNode,
  type Node,
  type OperationNodeData,
} from '~/lib/modules/nodes';
import {
  collectExpressionVariables,
  inferExpressionType,
  InferredType,
} from '~/utils';

export const createOperationDrawerData = (
  data?: OperationNodeData,
): OperationDrawerForm => ({
  [FormFields.LeftSide]: data?.[FormFields.LeftSide] ?? '',
  [FormFields.RightSide]: data?.[FormFields.RightSide] ?? '',
  [FormFields.Tree]: data?.[FormFields.Tree] ?? null,
  [FormFields.InferType]: data?.leftMeta?.type ?? LiteralVariants.Null,
  [FormFields.IsDeclaration]: data?.leftMeta?.isDeclaration ?? false,
});
export const createOperationNodeData = (
  data: OperationDrawerForm,
): OperationNodeData => ({
  [FormFields.LeftSide]: data[FormFields.LeftSide],
  [FormFields.RightSide]: data[FormFields.RightSide],
  [FormFields.Tree]: data[FormFields.Tree],
  leftMeta: {
    isDeclaration: data[FormFields.IsDeclaration],
    type: data[FormFields.InferType],
  },
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

const validateRightSideVariables = (
  expression: jsep.Expression | null | undefined,
  variablesSet: Set<string>,
) => {
  if (!expression) {
    return true;
  }

  const expressionVariables = collectExpressionVariables(expression);
  const missingVariables = [...expressionVariables].filter(
    (variable) => !variablesSet.has(variable),
  );

  if (!missingVariables.length) {
    return true;
  }

  const message =
    missingVariables.length === 1
      ? `Variable no disponible: ${missingVariables[0]}`
      : `Variables no disponibles: ${missingVariables.join(', ')}`;

  throw new yup.ValidationError(message, expression, FormFields.RightSide);
};

export const createSchema = (options: CreateOperationDrawerSchemaOptions) =>
  yup.object({
    [FormFields.LeftSide]: yup
      .string()
      .required('Campo requerido')
      .matches(VARIABLE_NAME_REGEX, 'Nombre de variable inválido'),
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

          return validateRightSideVariables(parsed, options.variablesSet);
        } catch (error) {
          if (error instanceof yup.ValidationError) {
            throw error;
          }

          throw new yup.ValidationError(
            mapJsepError(error as Error),
            value,
            FormFields.RightSide,
          );
        }
      }),
    [FormFields.Tree]: yup.object().nonNullable().required('Campo requerido'),
  });

export const inferOperationType = (
  tree: OperationDrawerForm['tree'],
): `${LiteralVariants}` => {
  if (!tree) return LiteralVariants.Null;

  const type = inferExpressionType(tree as Expression);

  switch (type) {
    case InferredType.String:
      return LiteralVariants.String;
    case InferredType.Number:
      return LiteralVariants.Number;
    case InferredType.Boolean:
      return LiteralVariants.Boolean;
    case InferredType.Null:
      return LiteralVariants.Null;
    default:
      return LiteralVariants.Null;
  }
};

export const isDeclarationVariable = (
  options: IsVariableFromListOptions,
  value: string,
) => {
  if (!value) {
    return false;
  }

  const { hasError, variablesSet } = options;

  if (hasError) {
    return false;
  }

  console.log('variablesSet.has(value)', variablesSet.has(value));
  return !variablesSet.has(value);
};

export const getPreviousVariables = (
  options: GetVariablesUntilOptions,
  node: Node | null,
) => {
  const variables: { name: string }[] = [];

  if (!node) return variables;

  let currentId: string | undefined = options.edges.get(node.id)?.previous;

  while (currentId) {
    const node = options.nodes.get(currentId);
    const edge = options.edges.get(currentId);

    if (node instanceof InputNode && node.data.name) {
      variables.push({ name: node.data.name });
    }

    if (node instanceof OperationNode && node.data.leftMeta.isDeclaration) {
      variables.push({ name: node.data.leftSide });
    }

    currentId = edge?.previous;
  }

  return variables;
};
