import type { Graph } from '~/lib/types';
import type { ProgramIR } from '~/lib/modules/ir';
import type { SidebarActionProps } from '../../Sidebar';

export interface CodeDrawerProps extends Pick<
  SidebarActionProps,
  'active' | 'defaultOpenPanel' | 'onclick'
> {}

export enum CodeLanguage {
  JavaScript = 'javascript',
  Python = 'python',
}

export type TryGetIRFromGraphOptions = Graph & {
  start: string;
};

export type CodeProgramState =
  | { kind: 'ready'; program: ProgramIR }
  | { kind: 'error'; error: Error };
