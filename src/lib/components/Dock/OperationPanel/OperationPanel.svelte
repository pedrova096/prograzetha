<script lang="ts">
  import { validator } from '@felte/validator-yup';
  import { createForm } from 'felte';
  import { GitCommitVertical, Lightbulb, Save } from '@lucide/svelte';

  import { getGraphContext } from '~/App.context.svelte';
  import { parseExpression } from '~/lib/modules/expression';
  import { NodeStates } from '~/lib/modules/nodes';
  import { CodeEditor, type CodeEditorProps } from '../../CodeEditor';
  import { Input } from '../../Input';
  import { Panel } from '../Panel';

  import {
    createOperationPanelData,
    createOperationNodeData,
    createSchema,
    getPreviousVariables,
    inferOperationType,
    isDeclarationVariable,
  } from './OperationPanel.utils';
  import {
    FormFields,
    type OperationForm,
    type OperationPanelProps,
  } from './OperationPanel.types';
  import { LiteralVariantBadge } from '../../LiteralVariantBadge';
  import { onMount } from 'svelte';

  let { node, onSave, onClose, onDismiss }: OperationPanelProps = $props();

  let { nodes, edges } = $derived(getGraphContext());

  let variablesList = $derived(getPreviousVariables({ nodes, edges }, node));
  let variablesSet = $derived(
    new Set(variablesList.map((variable) => variable.name)),
  );

  const {
    form,
    errors,
    touched,
    data,
    setData,
    setFields,
    setTouched,
    isValid,
  } = createForm<OperationForm>({
    // svelte-ignore state_referenced_locally
    extend: validator({ schema: createSchema({ variablesSet }) }),
    onSubmit: (values) => {
      if (!node) return;

      onSave(node.withUpdate(createOperationNodeData(values), NodeStates.Ok));
    },
    // svelte-ignore state_referenced_locally
    initialValues: createOperationPanelData(node?.data),
  });

  let leftFromList = $derived(
    isDeclarationVariable(
      {
        variablesSet,
        hasError: !!$errors[FormFields.LeftSide],
      },
      $data[FormFields.LeftSide],
    ),
  );

  $effect(() => {
    setData(FormFields.IsDeclaration, leftFromList);
  });

  const onCodeEditorChangeHandler: CodeEditorProps['onchange'] = (event) => {
    setTouched(FormFields.RightSide, true);

    try {
      const newTree = parseExpression(event.detail.value);
      setFields(FormFields.Tree, newTree);
      setFields(FormFields.InferType, inferOperationType(newTree));
    } catch {
      setFields(FormFields.Tree, null);
    }
  };

  onMount(() => () => node && onDismiss?.(node));
</script>

<Panel.Root>
  <Panel.Header label="Operación">
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="rounded-md px-2 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
        onclick={onClose}
      >
        Cerrar
      </button>
      <button
        type="submit"
        form="operation-form"
        class="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800"
      >
        <Save class="size-3.5" />
        Guardar
      </button>
    </div>
  </Panel.Header>
  <Panel.Divider />

  <Panel.Content>
    <form
      id="operation-form"
      use:form
      class="flex h-full min-h-0 flex-col gap-4"
    >
      <Input
        id={FormFields.LeftSide}
        name={FormFields.LeftSide}
        label="Variable"
        placeholder="Variable"
        value={$data[FormFields.LeftSide]}
        error={!!$errors[FormFields.LeftSide]}
        helper={$touched[FormFields.LeftSide]
          ? $errors[FormFields.LeftSide]
          : undefined}
        clearable
      />

      {#if $data[FormFields.InferType] && $touched[FormFields.RightSide]}
        <LiteralVariantBadge value={$data[FormFields.InferType]} />
      {/if}
      {#if $data[FormFields.IsDeclaration]}
        <div
          class="flex self-start rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900"
        >
          <Lightbulb class="mr-1 inline size-3.5" />
          Declaración de variable
        </div>
      {/if}

      <CodeEditor
        name={FormFields.RightSide}
        label="Operación"
        language="javascript"
        placeholder="1 + 1"
        bind:value={$data[FormFields.RightSide]}
        onchange={onCodeEditorChangeHandler}
        error={!!$errors[FormFields.RightSide]}
        helper={$errors[FormFields.RightSide]}
      />
    </form>
  </Panel.Content>
</Panel.Root>
