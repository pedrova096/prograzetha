import * as yup from 'yup';

import { InputNode, OperationNode, type Node } from '~/lib/modules/nodes';
import {
  FormFields,
  type GetVariablesUntilOptions,
  type OutputForm,
} from './OutputPanel.types';
import type { LiteralVariants } from '~/lib/constants';
import {
  createInterpolatedTextExpression,
  type Expression,
} from '~/lib/modules/expression';

export const createOutputPanelData = (
  data?: Partial<OutputForm>,
): OutputForm => ({
  [FormFields.Text]: data?.[FormFields.Text] ?? '',
});

export const schema = yup.object({
  [FormFields.Text]: yup.string().required('Campo requerido'),
});

export const getTemplateLiteral = (text: string): Expression =>
  createInterpolatedTextExpression(text);

export const getPreviousVariables = (
  options: GetVariablesUntilOptions,
  node: Node,
) => {
  const variables: { name: string; type: `${LiteralVariants}` }[] = [];

  let currentId: string | undefined = node.id;

  while (currentId) {
    const node = options.nodes.get(currentId);
    const edge = options.edges.get(currentId);

    if (node instanceof InputNode && node.data.name) {
      variables.push({
        name: node.data.name,
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
