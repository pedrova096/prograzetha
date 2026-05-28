import type { Node } from '~/lib/modules/nodes';
import type { Edge } from '~/lib/modules/edge';
import type { OperationNode } from '~/lib/modules/nodes';
import type { OperationNodeData } from '~/lib/modules/nodes/operationNode';

export enum FormFields {
  LeftSide = 'leftSide',
  RightSide = 'rightSide',
  Tree = 'tree',
  InferType = 'inferType',
  IsDeclaration = 'isDeclaration',
}

export type OperationDrawerForm = {
  [FormFields.LeftSide]: string;
  [FormFields.RightSide]: string;
  [FormFields.Tree]: OperationNodeData['tree'];
  [FormFields.InferType]: OperationNodeData['leftMeta']['type'];
  [FormFields.IsDeclaration]: boolean;
};

export type OperationDrawerProps = {
  node: OperationNode | null;
  onSave: (node: OperationNode) => void;
  onClose?: () => void;
};

export type GetVariablesUntilOptions = {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
};

export type CreateOperationDrawerSchemaOptions = {
  variablesSet: Set<string>;
};

export type IsVariableFromListOptions = {
  variablesSet: Set<string>;
  hasError: boolean;
};
