import type { Node } from '~/lib/modules/nodes';
import type { Edge } from '~/lib/modules/edge';
import type { OperationNode } from '~/lib/modules/nodes';
import type { OperationNodeData } from '~/lib/modules/nodes/operationNode';

export enum FormFields {
  LeftSide = 'leftSide',
  RightSide = 'rightSide',
  Tree = 'tree',
}

export type OperationDrawerForm = OperationNodeData;

export type OperationDrawerProps = {
  node: OperationNode | null;
  onSave: (node: OperationNode) => void;
  onClose?: () => void;
};

export type GetVariablesUntilOptions = {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
};
