import type { InputNode, InputType } from '~/lib/modules/nodes';
import type { FormNodeDrawer } from '../SidebarDrawer.types';

export enum FormFields {
  Name = 'name',
  Type = 'type',
}

export type InputDrawerForm = {
  [FormFields.Name]: string;
  [FormFields.Type]: `${InputType}`;
};

export interface InputDrawerProps extends FormNodeDrawer<InputNode> {}
