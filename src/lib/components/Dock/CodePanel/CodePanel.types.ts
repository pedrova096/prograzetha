import type { Graph } from '~/lib/types';
import type { ProgramIR } from '~/lib/modules/ir';
import type { GraphState } from '~/lib/modules/graph';

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

export type CodeGraphState =
  | { kind: 'ready'; graph: GraphState }
  | { kind: 'error'; error: Error };
