<script lang="ts">
  import { Code } from 'lucide-svelte';

  import { getDiagramContext } from '~/App.context.svelte';
  import type { Recordable } from '~/lib/types';
  import { getIR, JavaScript, Python } from '~/lib/modules/ir';
  import { debounce } from '~/lib/utils';
  import { RadioGroup } from '../../RadioGroup';
  import { Sidebar } from '../../Sidebar';
  import { Toggle } from '../../Toggle';
  import { CodeLanguage, type CodeDrawerProps } from './CodeDrawer.types';
  import { CodeEditor, Language, type CodeEditorProps } from '../../CodeEditor';
  import { LANGUAGE_OPTIONS } from './CodeDrawer.constants';

  let {
    active = false,
    defaultOpenPanel = false,
    onclick,
  }: CodeDrawerProps = $props();

  let edit = $state(false);
  let language = $state(`${CodeLanguage.JavaScript}`);
  let {
    diagram: { nodes, edges, start },
  } = $derived(getDiagramContext());

  let program = $derived(getIR({ nodes, edges }, start));

  let code = $state('');

  let editorLanguage = $derived(
    language === CodeLanguage.JavaScript ? Language.JavaScript : undefined,
  );

  let languageLabel = $derived(
    LANGUAGE_OPTIONS.find((option) => option.value === language)?.label ??
      'JavaScript',
  );

  $effect(() => {
    if (edit) return;

    code =
      language === CodeLanguage.Python
        ? Python.getTextFromIR(program)
        : JavaScript.encodeProgram(program);
  });

  const debouncedJavascriptCodeChanged = debounce(() => {
    console.log(JavaScript.decodeProgram(code));
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

      <CodeEditor
        label={languageLabel}
        language={editorLanguage}
        value={code}
        onchange={onCodeChangeHandler}
        readonly={!edit}
        class="min-h-0 flex-1 overflow-auto w-96"
      />
    </div>
  {/snippet}
</Sidebar.Action>
