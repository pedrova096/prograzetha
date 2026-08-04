import {
  snippetCompletion,
  type Completion,
  type CompletionSource,
} from '@codemirror/autocomplete';

import { InputFunctions } from '~/lib/modules/expression';
import { CodeLanguage } from '../CodeDrawer.types';
import type { AutocompleteConfig } from '~/lib/components/CodeEditor';

const DECLARATION_PATTERN = {
  [CodeLanguage.JavaScript]: /^\s*(?:let|const|var)\s+([A-Za-z_$][\w$]*)\b/gm,
  [CodeLanguage.Python]: /^\s*([A-Za-z_]\w*)\s*=(?!=)/gm,
};

const FUNCTION_COMPLETIONS: Completion[] = [
  snippetCompletion(`${InputFunctions.Number}()`, {
    label: InputFunctions.Number,
    detail: 'Leer un número',
    type: 'function',
  }),
  snippetCompletion(`${InputFunctions.Text}()`, {
    label: InputFunctions.Text,
    detail: 'Leer texto',
    type: 'function',
  }),
  snippetCompletion('output(${value})', {
    label: 'output',
    detail: 'Mostrar un valor',
    type: 'function',
  }),
];

const FUNCTION_NAMES = new Set(
  FUNCTION_COMPLETIONS.map((completion) => completion.label),
);

export const getVariablesDeclaredBeforeLine = (
  source: string,
  cursorPosition: number,
  language: CodeLanguage,
): string[] => {
  const currentLineStart = source.lastIndexOf('\n', cursorPosition - 1) + 1;
  const sourceBeforeLine = source.slice(0, currentLineStart);
  const variables = new Set<string>();

  for (const match of sourceBeforeLine.matchAll(
    DECLARATION_PATTERN[language],
  )) {
    variables.add(match[1]);
  }

  return [...variables];
};

const createCompletionSource = (language: CodeLanguage): CompletionSource => {
  return (context) => {
    const word = context.matchBefore(/[\w$]*/);
    if (!word || (word.from === word.to && !context.explicit)) return null;

    const variableCompletions: Completion[] = getVariablesDeclaredBeforeLine(
      context.state.doc.toString(),
      context.pos,
      language,
    )
      .filter((name) => !FUNCTION_NAMES.has(name))
      .map((name) => ({
        label: name,
        detail: 'Variable declarada',
        type: 'variable',
        boost: 10,
      }));

    return {
      from: word.from,
      options: [...variableCompletions, ...FUNCTION_COMPLETIONS],
      validFor: /^[\w$]*$/,
    };
  };
};

export const createCodeAutocomplete = (
  language: CodeLanguage,
): AutocompleteConfig => ({
  completions: createCompletionSource(language),
});
