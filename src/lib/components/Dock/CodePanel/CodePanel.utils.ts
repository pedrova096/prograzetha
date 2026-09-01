import { indexByProperty } from '~/utils/fp';
import { getGraphFromProgram, getIRFromGraph } from '~/lib/modules/ir';

import { LANG_MODULE_MAP, LANGUAGE_OPTIONS } from './CodePanel.constants';
import type {
  CodeProgramState,
  CodeGraphState,
  TryGetIRFromGraphOptions,
} from './CodePanel.types';
import { CodeLanguage } from './CodePanel.types';

const toError = (error: unknown): Error =>
  error instanceof Error
    ? error
    : new Error('No se pudo interpretar el código.');

export const getCodeProgramState = (
  options: TryGetIRFromGraphOptions,
): CodeProgramState => {
  try {
    const { nodes, edges, start } = options;
    return { kind: 'ready', program: getIRFromGraph({ nodes, edges }, start) };
  } catch (error) {
    return {
      kind: 'error',
      error: error as Error,
    };
  }
};

export const getCodeGraphState = (
  source: string,
  language: CodeLanguage,
): CodeGraphState => {
  try {
    const langModule = LANG_MODULE_MAP[language];
    const program = langModule.decodeProgram(source);
    const result = getGraphFromProgram(program, langModule.encodeExpression);

    return {
      kind: 'ready',
      graph: {
        nodes: result.nodes,
        edges: result.edges,
        start: result.startId,
      },
    };
  } catch (error) {
    return { kind: 'error', error: toError(error) };
  }
};

const INDEXED_LANGUAGE_OPTIONS = indexByProperty('value', LANGUAGE_OPTIONS);

export const getLanguageLabel = (language: CodeLanguage): string =>
  INDEXED_LANGUAGE_OPTIONS[language].label;
