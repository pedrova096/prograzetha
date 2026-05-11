import type { CompletionSource, Completion } from "@codemirror/autocomplete";
import type { EditorView } from "codemirror";
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export enum Language {
  JavaScript = "javascript",
  Json = "json",
}

export type CodeEditorChangeEvent = CustomEvent<{
  value: string;
  editor: EditorView | null;
}>;

export type AutocompleteConfig = {
  completions?: Completion[] | CompletionSource;
  highlightClass?: string;
  maxRenderedOptions?: number;
  defaultKeymap?: boolean;
  matcher?: RegExp;
};

export type CodeEditorProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "value" | "onchange" | "class"
> & {
  autocomplete?: AutocompleteConfig;
  class?: string;
  error?: boolean;
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
