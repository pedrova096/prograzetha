import * as yup from 'yup';

import {
  FormFields,
  type CreateOperationPanelSchemaOptions,
  type GetVariablesUntilOptions,
  type IsVariableFromListOptions,
  type OperationForm,
} from './OperationPanel.types';
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
import {
  parseExpression,
  tokenizeJavascriptExpression,
  type Expression,
} from '~/lib/modules/expression';

export const createOperationPanelData = (
  data?: OperationNodeData,
): OperationForm => ({
  [FormFields.LeftSide]: data?.[FormFields.LeftSide] ?? '',
  [FormFields.RightSide]: data?.[FormFields.RightSide] ?? '',
  [FormFields.Tree]: data?.[FormFields.Tree] ?? null,
  [FormFields.InferType]: data?.leftMeta?.type ?? LiteralVariants.Null,
  [FormFields.IsDeclaration]: data?.leftMeta?.isDeclaration ?? false,
});
export const createOperationNodeData = (
  data: OperationForm,
): OperationNodeData => ({
  [FormFields.LeftSide]: data[FormFields.LeftSide],
  [FormFields.RightSide]: data[FormFields.RightSide],
  [FormFields.Tree]: data[FormFields.Tree],
  leftMeta: {
    isDeclaration: data[FormFields.IsDeclaration],
    type: data[FormFields.InferType],
  },
});

const mapExpressionParseError = (error: Error) => {
  if (error.message.includes('Unexpected character: ')) {
    const char = error.message.split('Unexpected character: ')[1];
    return `Carácter inesperado ${char}`;
  }

  if (error.message.includes('Expected expression')) {
    return 'Falta argumento para la operación'; // example: + 1
  }

  if (error.message.includes('Expected Bracket')) {
    return 'Corchetes sin cerrar'; // example: [1 + 2
  }

  if (error.message.includes('Expected Dot')) {
    return 'Punto inesperado'; // example: 1.2.
  }

  if (error.message.includes('Unterminated string literal')) {
    return 'Comillas sin cerrar'; // example: "string
  }

  if (error.message.includes('Unexpected token')) {
    return 'Símbolo inesperado'; // example: 1 + #
  }

  if (error.message.includes('Expected Comma')) {
    return 'Se esperaba una coma'; // example: [1 2]
  }

  if (error.message.includes('Expected Paren')) {
    return 'Paréntesis sin cerrar'; // example: (1 + 2
  }

  if (error.message.includes('Expected Colon')) {
    return "Se esperaba un ':'"; // example: {a 1}
  }

  if (error.message.includes('Expected')) {
    return 'Expresión incompleta';
  }

  return 'Error en la expresión';
};

const validateRightSideVariables = (
  expression: Expression | null | undefined,
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

export const createSchema = (options: CreateOperationPanelSchemaOptions) =>
  yup.object({
    [FormFields.LeftSide]: yup
      .string()
      .required('Campo requerido')
      .matches(VARIABLE_NAME_REGEX, 'Nombre de variable inválido'),
    [FormFields.RightSide]: yup
      .string()
      .required('Campo requerido')
      .test('expression-error', 'Expresión inválida', (value) => {
        try {
          const parsed = parseExpression(
            value ?? '',
            tokenizeJavascriptExpression,
          );

          return validateRightSideVariables(parsed, options.variablesSet);
        } catch (error) {
          if (error instanceof yup.ValidationError) {
            throw error;
          }

          throw new yup.ValidationError(
            mapExpressionParseError(error as Error),
            value,
            FormFields.RightSide,
          );
        }
      }),
    [FormFields.Tree]: yup.object().nonNullable().required('Campo requerido'),
  });

export const inferOperationType = (
  tree: OperationForm['tree'],
): `${LiteralVariants}` => {
  if (!tree) return LiteralVariants.Null;

  const type = inferExpressionType(tree);

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
