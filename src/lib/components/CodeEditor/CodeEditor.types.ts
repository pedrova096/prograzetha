import type {
  CompletionSource,
  Completion,
  autocompletion,
} from '@codemirror/autocomplete';
import type { Extension } from '@codemirror/state';
import type { EditorView } from 'codemirror';
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export enum Language {
  JavaScript = 'javascript',
  Json = 'json',
}

export type CodeEditorChangeEvent = CustomEvent<{
  value: string;
  editor: EditorView | null;
}>;

export type AutocompleteConfig = {
  addToOptions?: NonNullable<
    Parameters<typeof autocompletion>[0]
  >['addToOptions'];
  completions?: Completion[] | CompletionSource;
  highlightClass?: string;
  icons?: boolean;
  maxRenderedOptions?: number;
  defaultKeymap?: boolean;
  matcher?: RegExp;
};

export type CodeEditorProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'value' | 'onchange'
> & {
  autocomplete?: AutocompleteConfig;
  error?: boolean;
  extensions?: Extension[];
  helper?: string[] | null;
  helperHint?: Snippet<[]>;
  label?: string;
  language?: `${Language}`;
  name?: string;
  onchange?: (event: CodeEditorChangeEvent) => void;
  readonly?: boolean;
  ref?: HTMLDivElement | null;
  value?: string;
};
