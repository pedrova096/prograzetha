import * as yup from 'yup';

import { InputNode, OperationNode, type Node } from '~/lib/modules/nodes';
import {
  FormFields,
  type GetVariablesUntilOptions,
  type OutputDrawerForm,
} from './OutputDrawer.types';

export const createOutputDrawerData = (
  data?: Partial<OutputDrawerForm>,
): OutputDrawerForm => ({
  [FormFields.Text]: data?.[FormFields.Text] ?? '',
});

export const schema = yup.object({
  [FormFields.Text]: yup.string().required('Campo requerido'),
});

export const getPreviousVariables = (
  options: GetVariablesUntilOptions,
  node: Node,
) => {
  const variables: string[] = [];

  let currentId: string | undefined = node.id;

  while (currentId) {
    const node = options.nodes.get(currentId);
    const edge = options.edges.get(currentId);

    if (node instanceof InputNode && node.data.variable) {
      variables.push(node.data.variable);
    }

    if (node instanceof OperationNode && node.data.isNewVariable) {
      variables.push(node.data.leftSide);
    }

    currentId = edge?.previous;
  }

  return variables.filter(Boolean);
};
