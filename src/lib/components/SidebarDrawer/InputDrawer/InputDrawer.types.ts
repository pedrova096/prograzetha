import type { InputNode } from '~/lib/modules/nodes/inputNode/inputNode';
import type { InputType } from '~/lib/modules/nodes/inputNode/inputNode.types';

export enum FormFields {
  Variable = 'variable',
  Type = 'type',
}

export type InputDrawerForm = {
  [FormFields.Variable]: string;
  [FormFields.Type]: `${InputType}`;
};

export type InputDrawerProps = {
  node: InputNode | null;
  onSave: (node: InputNode) => void;
  onClose?: () => void;
};
