import type { Edge } from '~/lib/modules/edge';
import type { Node, OutputNode, OutputNodeData } from '~/lib/modules/nodes';

export enum FormFields {
  Text = 'text',
}

export type OutputDrawerForm = OutputNodeData;

export type OutputDrawerProps = {
  node: OutputNode | null;
  onSave: (node: OutputNode) => void;
  onClose?: () => void;
};

export type GetVariablesUntilOptions = {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
};
