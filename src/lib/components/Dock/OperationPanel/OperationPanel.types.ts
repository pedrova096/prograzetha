import type { OperationNode } from '~/lib/modules/nodes';
import type { OperationNodeData } from '~/lib/modules/nodes/operationNode';
import type { Graph } from '~/lib/types';
import type { FormNodePanel } from '../Panel.types';

export enum FormFields {
  LeftSide = 'leftSide',
  RightSide = 'rightSide',
  Tree = 'tree',
  InferType = 'inferType',
  IsDeclaration = 'isDeclaration',
}

export type OperationForm = {
  [FormFields.LeftSide]: string;
  [FormFields.RightSide]: string;
  [FormFields.Tree]: OperationNodeData['tree'];
  [FormFields.InferType]: OperationNodeData['leftMeta']['type'];
  [FormFields.IsDeclaration]: boolean;
};

export type OperationPanelProps = FormNodePanel<OperationNode>;

export type GetVariablesUntilOptions = Graph;

export type CreateOperationPanelSchemaOptions = {
  variablesSet: Set<string>;
};

export type IsVariableFromListOptions = {
  variablesSet: Set<string>;
  hasError: boolean;
};
