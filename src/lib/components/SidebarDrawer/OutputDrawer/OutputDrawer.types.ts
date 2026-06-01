import type { Edge } from '~/lib/modules/edge';
import type { Node, OutputNode, OutputNodeData } from '~/lib/modules/nodes';
import type { FormNodeDrawer } from '../SidebarDrawer.types';

export enum FormFields {
  Text = 'text',
}

export type OutputDrawerForm = OutputNodeData;

export interface OutputDrawerProps extends FormNodeDrawer<OutputNode> {}

export type GetVariablesUntilOptions = {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
};
