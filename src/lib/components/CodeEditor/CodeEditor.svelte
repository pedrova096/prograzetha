<script lang="ts">
  import { javascript } from '@codemirror/lang-javascript';
  import { Compartment, EditorState } from '@codemirror/state';
  import { minimalSetup, EditorView } from 'codemirror';
  import { onMount } from 'svelte';
  import {
    keymap,
    placeholder as placeholderExtension,
  } from '@codemirror/view';
  import {
    autocompletion,
    completionKeymap,
    startCompletion,
    type CompletionSource,
  } from '@codemirror/autocomplete';

  import { Language, type CodeEditorProps } from './CodeEditor.types';
  import { javascriptTheme } from './CodeEditor.theme';

  let editor = $state<EditorView | null>(null);
  const readonlyCompartment = new Compartment();

  let {
    autocomplete: autocompleteConfig,
    class: className,
    error,
    extensions: extensionConfig = [],
    helper,
    helperHint,
    id,
    label: labelFromProps,
    language,
    name,
    onchange,
    placeholder,
    readonly,
    ref = $bindable<HTMLDivElement | null>(null),
    value = $bindable(''),
    ...restProps
  }: CodeEditorProps = $props();

  let editorValue = $derived(
    new Proxy(
      { value: '' },
      {
        get() {
          return editor?.state.doc.toString();
        },
        set(_, __, value) {
          if (editorValue.value === value) return true;

          editor?.dispatch({
            changes: {
              from: 0,
              to: editor.state.doc.length,
              insert: value,
            },
          });
          return true;
        },
      },
    ),
  );

  // Create completion source from config
  function createCompletionSource(): CompletionSource | null {
    if (!autocompleteConfig?.completions) return null;

    if (typeof autocompleteConfig.completions === 'function') {
      return autocompleteConfig.completions;
    }

    const completions = autocompleteConfig.completions;
    const matcherRegex = autocompleteConfig.matcher ?? /(\w+\.?)+/;

    return (context) => {
      const word = context.matchBefore(matcherRegex);
      if (!word || (word.from === word.to && !context.explicit)) return null;

      return {
        from: word.from,
        options: completions.map((completion) => ({
          ...completion,
          // Add custom highlight class if specified
          class: autocompleteConfig.highlightClass
            ? `cm-completion-custom ${autocompleteConfig.highlightClass}`
            : undefined,
        })),
      };
    };
  }

  const preventEditorDrop = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    return true;
  };

  const createReadonlyExtensions = (value?: boolean) => [
    EditorView.editable.of(!value),
    EditorState.readOnly.of(!!value),
  ];

  onMount(() => {
    if (!ref) return;

    const extensions = [
      minimalSetup,
      EditorView.lineWrapping,
      EditorView.editorAttributes.of({
        class: ['editor-Ω', className].filter(Boolean).join(' '),
      }),
      EditorView.domEventHandlers({
        dragenter: preventEditorDrop,
        dragover: preventEditorDrop,
        drop: preventEditorDrop,
      }),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && update.view.hasFocus) {
          value = update.state.doc.toString();

          const changeEvent = new CustomEvent('docChange', {
            detail: { value, editor },
          });
          onchange?.(changeEvent);
        }
      }),
      readonlyCompartment.of(createReadonlyExtensions(readonly)),
      ...extensionConfig,
    ];

    if (language === Language.JavaScript) {
      extensions.push(javascript(), javascriptTheme);
    }

    // Add autocomplete if configured
    if (autocompleteConfig) {
      const completionSource = createCompletionSource();

      if (completionSource) {
        extensions.push(
          keymap.of([
            ...completionKeymap,
            { key: 'Ctrl-Space', run: startCompletion },
          ]),
          autocompletion({
            override: [completionSource],
            addToOptions: autocompleteConfig.addToOptions,
            icons: autocompleteConfig.icons,
            maxRenderedOptions: autocompleteConfig.maxRenderedOptions ?? 10,
            defaultKeymap: autocompleteConfig.defaultKeymap ?? true,
          }),
        );
      }
    }

    if (placeholder) {
      extensions.push(placeholderExtension(placeholder));
    }

    editor = new EditorView({
      doc: value,
      extensions,
      parent: ref,
    });

    return () => {
      editor?.destroy();
      editor = null;
    };
  });

  $effect(() => {
    editorValue.value = value;
  });

  $effect(() => {
    editor?.dispatch({
      effects: readonlyCompartment.reconfigure(
        createReadonlyExtensions(readonly),
      ),
    });
  });
</script>

<div class="flex w-full flex-col gap-1.5">
  <label class={'block text-sm font-medium text-zinc-700'} for={id}>
    {labelFromProps}
  </label>

  <div bind:this={ref} {...restProps}></div>

  {@render helperHint?.()}
  <p class={['text-muted-foreground text-sm', error && 'text-red-500']}>
    {helper}
  </p>
</div>

<style lang="postcss">
  @reference "../../app.css";

  :global(.editor-Ω) {
    @apply flex w-full rounded-md border border-zinc-200 bg-zinc-50 px-0.5 py-0.5 text-sm ring-offset-zinc-50 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50;

    & :global(.cm-line) {
    }
  }

  /* Default autocomplete styling */
  :global(.cm-tooltip-autocomplete) {
    @apply rounded-md border border-zinc-200 bg-white shadow-lg;
  }

  :global(.cm-tooltip-autocomplete > ul) {
    @apply max-h-40 overflow-auto;
  }

  :global(.cm-tooltip-autocomplete ul li) {
    @apply cursor-pointer px-3 py-1.5 text-sm;
  }

  :global(.cm-tooltip-autocomplete ul li[aria-selected]) {
    @apply bg-teal-100 text-teal-900;
  }

  /* Custom highlight class styling */
  :global(.cm-completion-custom) {
    @apply font-semibold;
  }

  /* You can add more specific highlight classes */
  :global(.cm-completion-variable) {
    @apply bg-blue-50 text-blue-600;
  }

  :global(.cm-completion-function) {
    @apply bg-green-50 text-green-600;
  }

  :global(.cm-completion-keyword) {
    @apply bg-purple-50 text-purple-600;
  }

  :global(.cm-mention-token) {
    @apply inline-flex items-center gap-1 rounded border px-1 font-semibold;
  }
</style>
