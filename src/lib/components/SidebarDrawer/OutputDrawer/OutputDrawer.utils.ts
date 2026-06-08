import * as yup from 'yup';
import type jsep from 'jsep';

import { InputNode, OperationNode, type Node } from '~/lib/modules/nodes';
import {
  FormFields,
  type GetVariablesUntilOptions,
  type OutputDrawerForm,
} from './OutputDrawer.types';
import type { LiteralVariants } from '~/lib/constants';

export const createOutputDrawerData = (
  data?: Partial<OutputDrawerForm>,
): OutputDrawerForm => ({
  [FormFields.Text]: data?.[FormFields.Text] ?? '',
});

export const schema = yup.object({
  [FormFields.Text]: yup.string().required('Campo requerido'),
});

const createStringLiteral = (value: string): jsep.Literal => ({
  type: 'Literal',
  value,
  raw: JSON.stringify(value),
});

export const getTemplateLiteral = (text: string): jsep.Expression => {
  const parts: jsep.Expression[] = [];
  const variableRegex = /\$([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = variableRegex.exec(text)) !== null) {
    const beforeText = text.slice(lastIndex, match.index);

    if (beforeText) {
      parts.push(createStringLiteral(beforeText));
    }

    parts.push({
      type: 'Identifier',
      name: match[1],
    });

    lastIndex = match.index + match[0].length;
  }

  const tailText = text.slice(lastIndex);

  if (tailText) {
    parts.push(createStringLiteral(tailText));
  }

  if (parts.length === 0) {
    return createStringLiteral(text);
  }

  const [firstPart, ...restParts] = parts;

  return restParts.reduce<jsep.Expression>(
    (expression, part) => ({
      type: 'BinaryExpression',
      operator: '+',
      left: expression,
      right: part,
    }),
    firstPart,
  );
};

export const getPreviousVariables = (
  options: GetVariablesUntilOptions,
  node: Node,
) => {
  const variables: { name: string; type: `${LiteralVariants}` }[] = [];

  let currentId: string | undefined = node.id;

  while (currentId) {
    const node = options.nodes.get(currentId);
    const edge = options.edges.get(currentId);

    if (node instanceof InputNode && node.data.variable) {
      variables.push({
        name: node.data.variable,
        type: node.data.type,
      });
    }

    if (node instanceof OperationNode && node.data.leftMeta.isDeclaration) {
      variables.push({
        name: node.data.leftSide,
        type: node.data.leftMeta.type,
      });
    }

    currentId = edge?.previous;
  }

  return variables.filter(Boolean);
};
