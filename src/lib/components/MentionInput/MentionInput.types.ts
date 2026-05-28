import type { CodeEditorProps } from '../CodeEditor';

export type MentionInputOption = {
  label: string;
  value: string;
  type?: string;
  icon?: string;
  colorClass?: string;
  className?: string;
  detail?: string;
  [key: string]: unknown;
};

export interface MentionInputProps extends Omit<
  CodeEditorProps,
  'autocomplete' | 'extensions'
> {
  options?: MentionInputOption[];
  trigger?: string;
  minQueryLength?: number;
  maxVisibleOptions?: number;
  optionLabel?: string;
  optionValue?: string;
  filterOptions?: (
    options: MentionInputOption[],
    query: string,
  ) => MentionInputOption[];
  formatInsertedValue?: (
    option: MentionInputOption,
    trigger: string,
  ) => string;
}

export type MentionInputConfig = {
  options: MentionInputOption[];
  trigger: string;
  minQueryLength: number;
  optionLabel: string;
  optionValue: string;
  filterOptions?: (
    options: MentionInputOption[],
    query: string,
  ) => MentionInputOption[];
  formatInsertedValue: (
    option: MentionInputOption,
    trigger: string,
  ) => string;
};

export type ActiveMention = {
  triggerFrom: number;
  queryFrom: number;
  query: string;
};
