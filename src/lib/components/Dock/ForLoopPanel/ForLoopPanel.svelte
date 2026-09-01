<script lang="ts">
  import { validator } from '@felte/validator-yup';
  import { createForm } from 'felte';
  import { Repeat, Save } from '@lucide/svelte';
  import { onMount } from 'svelte';

  import { NodeStates } from '~/lib/modules/nodes';
  import { Input } from '../../Input';
  import { Panel } from '../Panel';
  import type {
    ForLoopForm,
    ForLoopPanelProps,
  } from './ForLoopPanel.types';
  import { FormFields } from './ForLoopPanel.types';
  import {
    createForLoopPanelData,
    createForLoopNodeData,
    schema,
  } from './ForLoopPanel.utils';

  let { node, onSave, onClose, onDismiss }: ForLoopPanelProps = $props();

  const { form, errors, touched, data, setData, reset } =
    createForm<ForLoopForm>({
      extend: validator({ schema }),
      onSubmit: (values) => {
        if (!node) return;

        onSave(node.withUpdate(createForLoopNodeData(values), NodeStates.Ok));
      },
      // svelte-ignore state_referenced_locally
      initialValues: createForLoopPanelData(node),
    });

  $effect(() => {
    reset();
    setData(createForLoopPanelData(node));
  });

  onMount(() => () => node && onDismiss?.(node));
</script>

<Panel.Root>
  <Panel.Header label="Para">
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
        form="for-loop-form"
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
      id="for-loop-form"
      use:form
      class="flex h-full min-h-0 flex-col gap-4"
    >
      <p class="text-xs text-zinc-500">
        El límite final no se incluye en el recorrido.
      </p>
      <div class="flex flex-col gap-4">
        <Input
          id={FormFields.Iterator}
          name={FormFields.Iterator}
          label="Variable iteradora"
          placeholder="i"
          value={$data[FormFields.Iterator]}
          error={!!$errors[FormFields.Iterator]}
          helper={$touched[FormFields.Iterator]
            ? $errors[FormFields.Iterator]
            : undefined}
          clearable
        />
        <Input
          id={FormFields.Start}
          name={FormFields.Start}
          type="number"
          label="Inicio"
          placeholder="0"
          value={$data[FormFields.Start]}
          error={!!$errors[FormFields.Start]}
          helper={$touched[FormFields.Start]
            ? $errors[FormFields.Start]
            : undefined}
          clearable
        />
        <Input
          id={FormFields.End}
          name={FormFields.End}
          type="number"
          label="Límite final (exclusivo)"
          placeholder="10"
          value={$data[FormFields.End]}
          error={!!$errors[FormFields.End]}
          helper={$touched[FormFields.End]
            ? $errors[FormFields.End]
            : undefined}
          clearable
        />
        <Input
          id={FormFields.Step}
          name={FormFields.Step}
          type="number"
          label="Paso"
          placeholder="1"
          value={$data[FormFields.Step]}
          error={!!$errors[FormFields.Step]}
          helper={$touched[FormFields.Step]
            ? $errors[FormFields.Step]
            : undefined}
          clearable
        />
      </div>
    </form>
  </Panel.Content>
</Panel.Root>
