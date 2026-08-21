import type { ForLoopNode } from '~/lib/modules/nodes';
import type { FormNodeDrawer } from '../SidebarDrawer.types';

export enum FormFields {
  Iterator = 'iterator',
  Start = 'start',
  End = 'end',
  Step = 'step',
}

export type ForLoopDrawerForm = {
  [FormFields.Iterator]: string;
  [FormFields.Start]: number;
  [FormFields.End]: number;
  [FormFields.Step]: number;
};

export interface ForLoopDrawerProps extends FormNodeDrawer<ForLoopNode> {}
