import type { OutputNode, OutputNodeData } from '~/lib/modules/nodes';
import type { Graph } from '~/lib/types';
import type { FormNodeDrawer } from '../SidebarDrawer.types';

export enum FormFields {
  Text = 'text',
}

export type OutputDrawerForm = OutputNodeData;

export interface OutputDrawerProps extends FormNodeDrawer<OutputNode> {}

export type GetVariablesUntilOptions = Graph;
