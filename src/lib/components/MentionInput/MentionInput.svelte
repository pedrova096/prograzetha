<script lang="ts">
  import { CodeEditor } from '../CodeEditor';
  import type { MentionInputProps } from './MentionInput.types';
  import {
    atomicMentionDeletion,
    createMentionCompletionSource,
    mentionCompletionIconRenderer,
    mentionDecorations,
  } from './MentionInput.utils';

  let {
    value = $bindable(''),
    options = [],
    trigger = '$',
    minQueryLength = 0,
    maxVisibleOptions = 8,
    optionLabel = 'label',
    optionValue = 'value',
    filterOptions,
    formatInsertedValue = (option, trigger) =>
      `${trigger}${String(option[optionValue] ?? option.value)} `,
    ...restProps
  }: MentionInputProps = $props();

  const mentionAutocomplete = $derived({
    addToOptions: [mentionCompletionIconRenderer],
    completions: createMentionCompletionSource({
      options,
      trigger,
      minQueryLength,
      optionLabel,
      optionValue,
      filterOptions,
      formatInsertedValue,
    }),
    icons: false,
    maxRenderedOptions: maxVisibleOptions,
  });

  const extensions = $derived([
    atomicMentionDeletion(options, trigger, optionValue),
    mentionDecorations(options, trigger, optionValue),
  ]);
</script>

<CodeEditor
  bind:value
  autocomplete={mentionAutocomplete}
  {extensions}
  {...restProps}
/>
