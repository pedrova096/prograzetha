import type { InputNode, InputType } from '~/lib/modules/nodes';
import type { FormNodeDrawer } from '../SidebarDrawer.types';

export enum FormFields {
  Variable = 'variable',
  Type = 'type',
}

export type InputDrawerForm = {
  [FormFields.Variable]: string;
  [FormFields.Type]: `${InputType}`;
};

export interface InputDrawerProps extends FormNodeDrawer<InputNode> {}
