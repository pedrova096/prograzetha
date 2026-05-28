import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import type { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { tags } from '@lezer/highlight';

export const javascriptTheme: Extension = [
  EditorView.theme({
    '&': {
      color: '#27272a',
    },
    '.cm-content': {
      caretColor: '#0f766e',
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: '#0f766e',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
      {
        backgroundColor: '#ccfbf1',
      },
    '.cm-placeholder': {
      color: '#a1a1aa',
    },
  }),
  syntaxHighlighting(
    HighlightStyle.define([
      { tag: tags.keyword, color: '#7c3aed', fontWeight: '600' },
      { tag: [tags.name, tags.deleted, tags.character], color: '#0f766e' },
      { tag: [tags.propertyName], color: '#0369a1' },
      { tag: [tags.function(tags.variableName)], color: '#2563eb' },
      { tag: [tags.variableName], color: '#334155' },
      { tag: [tags.number, tags.bool, tags.null], color: '#c2410c' },
      { tag: [tags.string, tags.special(tags.string)], color: '#15803d' },
      { tag: [tags.operator, tags.punctuation], color: '#52525b' },
      { tag: tags.comment, color: '#71717a', fontStyle: 'italic' },
      { tag: tags.invalid, color: '#dc2626' },
    ]),
  ),
];
