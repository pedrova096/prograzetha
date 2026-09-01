import type { OutputNode, OutputNodeData } from '~/lib/modules/nodes';
import type { Graph } from '~/lib/types';
import type { FormNodePanel } from '../Panel.types';

export enum FormFields {
  Text = 'text',
}

export type OutputForm = OutputNodeData;

export type OutputPanelProps = FormNodePanel<OutputNode>;

export type GetVariablesUntilOptions = Graph;
