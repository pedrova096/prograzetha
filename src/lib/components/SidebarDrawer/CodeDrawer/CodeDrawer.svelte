<script lang="ts">
  import { CircleAlert, Code } from '@lucide/svelte';
  import { onDestroy } from 'svelte';

  import { getGraphContext } from '~/App.context.svelte';
  import type { Recordable } from '~/lib/types';
  import { debounce } from '~/lib/utils';
  import { RadioGroup, type RadioGroupProps } from '../../RadioGroup';
  import { Sidebar } from '../../Sidebar';
  import { Toggle } from '../../Toggle';
  import { CodeLanguage, type CodeDrawerProps } from './CodeDrawer.types';
  import { CodeEditor, Language, type CodeEditorProps } from '../../CodeEditor';
  import { LANGUAGE_OPTIONS, LANG_MODULE_MAP } from './CodeDrawer.constants';
  import {
    getCodeGraphState,
    getCodeProgramState,
    getLanguageLabel,
  } from './CodeDrawer.utils';
  import { createCodeAutocomplete } from './autocomplete';

  let {
    active = false,
    defaultOpenPanel = false,
    onclick,
  }: CodeDrawerProps = $props();

  let edit = $state(false);
  let language = $state<CodeLanguage>(CodeLanguage.JavaScript);
  const graph = getGraphContext();
  let { nodes, edges, start } = $derived(graph);
  let programState = $derived(getCodeProgramState({ nodes, edges, start }));

  let code = $state('');
  let parseError = $state<Error | null>(null);
  // let previousLanguage = $state<CodeLanguage>(CodeLanguage.JavaScript);

  let editorLanguage = $derived(
    language === CodeLanguage.JavaScript ? Language.JavaScript : undefined,
  );

  let languageLabel = $derived(getLanguageLabel(language));

  const codeAutocomplete = $derived(createCodeAutocomplete(language));

  const encodeProgram = (languageFromOption?: CodeLanguage) => {
    if (programState.kind !== 'ready') return null;
    let selectedLanguage = languageFromOption || language;

    return LANG_MODULE_MAP[selectedLanguage].encodeProgram(
      programState.program,
    );
  };

  const commitCode = (source: string, sourceLanguage: CodeLanguage) => {
    const result = getCodeGraphState(source, sourceLanguage);

    if (result.kind === 'error') {
      parseError = result.error;
      return;
    }

    graph.replace(result.graph);
    parseError = null;
  };

  const debouncedCodeChanged = debounce(commitCode, 600);

  $effect(() => {
    if (edit) return;

    debouncedCodeChanged.cancel();
    parseError = null;

    const generatedCode = encodeProgram();
    if (generatedCode !== null) code = generatedCode;
  });

  const onCodeChangeHandler: CodeEditorProps['onchange'] = (event) => {
    code = event.detail.value;
    parseError = null;
    debouncedCodeChanged(code, language);
  };

  const onLanguageChangeHandler: RadioGroupProps<
    { value: CodeLanguage },
    'value'
  >['onchange'] = (event) => {
    let newLanguage = event.detail.value;

    if (!newLanguage) return;

    debouncedCodeChanged.cancel();
    parseError = null;

    const generatedCode = encodeProgram(newLanguage);
    if (generatedCode === null) return;

    code = generatedCode;
  };

  onDestroy(debouncedCodeChanged.cancel);
</script>

<Sidebar.Action
  icon={Code}
  id="code"
  label="Código"
  panelTitle="Código"
  {active}
  {defaultOpenPanel}
  {onclick}
>
  {#snippet panel()}
    <div class="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      {#snippet languageOption(option: Recordable, selected: boolean)}
        <span class="inline-flex items-center gap-2">
          <img
            src={String(option.icon)}
            alt=""
            class={['size-4', selected ? 'opacity-100' : 'opacity-60']}
          />
          <span>{option.label}</span>
        </span>
      {/snippet}

      <RadioGroup
        name="code-language"
        label="Lenguaje"
        options={LANGUAGE_OPTIONS}
        optionLabel="label"
        optionValue="value"
        optionRender={languageOption}
        bind:value={language}
        onchange={onLanguageChangeHandler}
        classNames={{
          radioContainer: 'grid w-full grid-cols-2',
          radioWrapper: 'w-full',
          radioLabel: 'w-full px-3 py-2',
        }}
      />

      <Toggle label="Editar" bind:checked={edit} />
      {#if programState.kind === 'ready' || edit}
        <CodeEditor
          label={languageLabel}
          language={editorLanguage}
          value={code}
          onchange={onCodeChangeHandler}
          readonly={!edit}
          autocomplete={codeAutocomplete}
          error={parseError !== null}
          class="min-h-0 flex-1 overflow-auto w-96"
        />
        {#if parseError}
          <div
            class="flex flex-col gap-2 rounded-md border border-red-200 bg-red-50 p-3"
            role="alert"
            aria-live="polite"
            aria-label="Diagnóstico del código"
          >
            <div
              class="flex items-center gap-2 text-sm font-semibold text-red-900"
            >
              <CircleAlert class="size-4 shrink-0" />
              No se pudo interpretar {languageLabel}.
            </div>
            <p class="break-words text-sm text-red-800">
              {parseError.message}
            </p>
          </div>
        {/if}
      {:else}
        <div
          class="flex flex-col gap-3 rounded-md border border-red-200 bg-red-50 p-3"
          role="alert"
          aria-label="Error de código"
        >
          <div
            class="flex items-center gap-2 text-sm font-semibold text-red-900"
          >
            <CircleAlert class="size-4" />
            No se puede generar el código.
          </div>

          <p class="break-words text-sm text-red-800">
            {programState.error.message}
          </p>
        </div>
      {/if}
    </div>
  {/snippet}
</Sidebar.Action>
