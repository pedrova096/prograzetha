import type { InputNode, InputType } from '~/lib/modules/nodes';
import type { FormNodePanel } from '../Panel.types';

export enum FormFields {
  Name = 'name',
  Type = 'type',
}

export type InputForm = {
  [FormFields.Name]: string;
  [FormFields.Type]: `${InputType}`;
};

export type InputPanelProps = FormNodePanel<InputNode>;
