<script lang="ts">
  import { CircleAlert, Code } from 'lucide-svelte';

  import { getGraphContext } from '~/App.context.svelte';
  import type { Recordable } from '~/lib/types';
  import { getGraphFromProgram } from '~/lib/modules/ir';
  import { JavaScript, Python } from '~/lib/modules/ir/languages';
  import { debounce } from '~/lib/utils';
  import { RadioGroup } from '../../RadioGroup';
  import { Sidebar } from '../../Sidebar';
  import { Toggle } from '../../Toggle';
  import { CodeLanguage, type CodeDrawerProps } from './CodeDrawer.types';
  import { CodeEditor, Language, type CodeEditorProps } from '../../CodeEditor';
  import { LANGUAGE_OPTIONS } from './CodeDrawer.constants';
  import { getCodeProgramState, getLanguageLabel } from './CodeDrawer.utils';

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

  let editorLanguage = $derived(
    language === CodeLanguage.JavaScript ? Language.JavaScript : undefined,
  );

  let languageLabel = $derived(getLanguageLabel(language));

  $effect(() => {
    if (edit || programState.kind !== 'ready') return;

    code =
      language === CodeLanguage.Python
        ? Python.encodeProgram(programState.program)
        : JavaScript.encodeProgram(programState.program);
  });

  const debouncedJavascriptCodeChanged = debounce(() => {
    const result = getGraphFromProgram(
      JavaScript.decodeProgram(code),
      JavaScript.encodeExpression,
    );
    graph.replace({
      nodes: result.nodes,
      edges: result.edges,
      start: result.startId,
    });
  }, 600);

  const onCodeChangeHandler: CodeEditorProps['onchange'] = (event) => {
    code = event.detail.value;

    if (language === CodeLanguage.Python) {
      debouncedJavascriptCodeChanged.cancel();
      return;
    }

    debouncedJavascriptCodeChanged();
  };
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
          class="min-h-0 flex-1 overflow-auto w-96"
        />
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
