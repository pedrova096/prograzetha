<script lang="ts">
  import { validator } from '@felte/validator-yup';
  import { createForm } from 'felte';
  import { GitCommitVertical, Lightbulb, Save } from 'lucide-svelte';

  import { getDiagramContext } from '~/App.context.svelte';
  import {
    parseExpression,
  } from '~/lib/modules/expression';
  import { NodeStates } from '~/lib/modules/nodes';
  import { CodeEditor, type CodeEditorProps } from '../../CodeEditor';
  import { Input } from '../../Input';
  import { Sidebar } from '../../Sidebar';

  import {
    createOperationDrawerData,
    createOperationNodeData,
    createSchema,
    getPreviousVariables,
    inferOperationType,
    isDeclarationVariable,
  } from './OperationDrawer.utils';
  import {
    FormFields,
    type OperationDrawerForm,
    type OperationDrawerProps,
  } from './OperationDrawer.types';
  import { LiteralVariantBadge } from '../../LiteralVariantBadge';
  import { onMount } from 'svelte';

  let { node, onSave, onClose, onDismiss }: OperationDrawerProps = $props();

  let {
    diagram: { nodes, edges },
  } = $derived(getDiagramContext());

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
  } = createForm<OperationDrawerForm>({
    // svelte-ignore state_referenced_locally
    extend: validator({ schema: createSchema({ variablesSet }) }),
    onSubmit: (values) => {
      if (!node) return;

      onSave(node.withUpdate(createOperationNodeData(values), NodeStates.Ok));
    },
    // svelte-ignore state_referenced_locally
    initialValues: createOperationDrawerData(node?.data),
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
      const newTree = parseExpression(
        event.detail.value,
      );
      setFields(FormFields.Tree, newTree);
      setFields(FormFields.InferType, inferOperationType(newTree));
    } catch {
      setFields(FormFields.Tree, null);
    }
  };

  $inspect($data[FormFields.IsDeclaration], {
    variablesSet,
    hasError: !!$errors[FormFields.LeftSide],
    isTouched: $touched[FormFields.LeftSide],
  });

  onMount(() => () => node && onDismiss?.(node));
</script>

<Sidebar.Action
  icon={GitCommitVertical}
  id="node-operation"
  label="Nodo"
  panelTitle="Operación"
  defaultOpenPanel
>
  {#snippet panelActions()}
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
        form="operation-drawer-form"
        class="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800"
      >
        <Save class="size-3.5" />
        Guardar
      </button>
    </div>
  {/snippet}

  {#snippet panel()}
    <form
      id="operation-drawer-form"
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
  {/snippet}
</Sidebar.Action>
