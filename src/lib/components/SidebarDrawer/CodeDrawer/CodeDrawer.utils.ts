import { indexByProperty } from '~/utils/fp';
import { getIRFromGraph } from '~/lib/modules/ir';

import { LANGUAGE_OPTIONS } from './CodeDrawer.constants';
import {
  CodeLanguage,
  type CodeProgramState,
  type TryGetIRFromGraphOptions,
} from './CodeDrawer.types';

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

const INDEXED_LANGUAGE_OPTIONS = indexByProperty('value', LANGUAGE_OPTIONS);

export const getLanguageLabel = (language: CodeLanguage): string =>
  (
    INDEXED_LANGUAGE_OPTIONS[language] ??
    INDEXED_LANGUAGE_OPTIONS[CodeLanguage.JavaScript]
  ).label;
