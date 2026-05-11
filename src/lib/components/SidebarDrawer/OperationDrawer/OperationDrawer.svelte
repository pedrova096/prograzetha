<script lang="ts">
  import { validator } from '@felte/validator-yup';
  import { createForm } from 'felte';
  import jsep from 'jsep';
  import { GitCommitVertical, Lightbulb, Save } from 'lucide-svelte';

  import { getDiagramContext } from '~/App.context.svelte';
  import { NodeStates } from '~/lib/modules/nodes';
  import { CodeEditor, type CodeEditorProps } from '../../CodeEditor';
  import { Input } from '../../Input';
  import { Sidebar } from '../../Sidebar';

  import {
    createOperationDrawerData,
    getPreviousVariables,
    isVariableFromList,
    schema,
  } from './OperationDrawer.utils';
  import {
    FormFields,
    type OperationDrawerForm,
    type OperationDrawerProps,
  } from './OperationDrawer.types';

  let { node, onSave, onClose }: OperationDrawerProps = $props();

  let {
    diagram: { nodes, edges },
  } = $derived(getDiagramContext());

  let variablesList = $derived(getPreviousVariables({ nodes, edges }, node));

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
    extend: validator({ schema }),
    onSubmit: (values) => {
      if (!node) return;

      const isNewVariable = !variablesList.some(
        (variable) => variable.name === values[FormFields.LeftSide],
      );

      onSave(
        node.withUpdate(
          {
            ...values,
            isNewVariable,
          },
          NodeStates.Ok,
        ),
      );
    },
    // svelte-ignore state_referenced_locally
    initialValues: createOperationDrawerData(node?.data),
  });

  $effect(() => {
    setData(createOperationDrawerData(node?.data));
  });

  const onCodeEditorChangeHandler: CodeEditorProps['onchange'] = (event) => {
    setTouched(FormFields.RightSide, true);

    try {
      setFields(FormFields.Tree, jsep(event.detail.value));
    } catch {
      setFields(FormFields.Tree, null);
    }
  };

  let leftFromList = $derived(
    isVariableFromList(
      {
        list: variablesList,
        hasError: !!$errors[FormFields.LeftSide],
        isTouched: $touched[FormFields.LeftSide],
      },
      $data[FormFields.LeftSide],
    ),
  );
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

      {#if leftFromList !== null && !leftFromList}
        <div
          class="flex self-start rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900"
        >
          <Lightbulb class="mr-1 inline size-3.5" />
          Variable nueva
        </div>
      {/if}

      <CodeEditor
        name={FormFields.RightSide}
        label="Operación"
        placeholder="1 + 1"
        bind:value={$data[FormFields.RightSide]}
        onchange={onCodeEditorChangeHandler}
        error={!!$errors[FormFields.RightSide]}
        helper={$errors[FormFields.RightSide]}
      />

      {#if $isValid && $data[FormFields.Tree]}
        {@const fullOperation = `${leftFromList ? '' : 'let '}${$data[FormFields.LeftSide]} = ${$data[FormFields.RightSide]}`}

        <CodeEditor
          name={FormFields.Tree}
          value={fullOperation}
          error={!!$errors[FormFields.Tree]}
          helper={$errors[FormFields.Tree]}
          readonly
          class="!bg-zinc-100 !text-xs"
        />
      {/if}
    </form>
  {/snippet}
</Sidebar.Action>
