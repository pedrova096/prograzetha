import type { ForLoopNode } from '~/lib/modules/nodes';
import type { FormNodePanel } from '../Panel.types';

export enum FormFields {
  Iterator = 'iterator',
  Start = 'start',
  End = 'end',
  Step = 'step',
}

export type ForLoopForm = {
  [FormFields.Iterator]: string;
  [FormFields.Start]: number;
  [FormFields.End]: number;
  [FormFields.Step]: number;
};

export type ForLoopPanelProps = FormNodePanel<ForLoopNode>;
