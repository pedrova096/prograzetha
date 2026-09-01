<script lang="ts">
  import { validator } from '@felte/validator-yup';
  import { createForm } from 'felte';
  import { GitCommitVertical, Save } from '@lucide/svelte';

  import { NodeStates } from '~/lib/modules/nodes';
  import { Input } from '../../Input';
  import { RadioGroup } from '../../RadioGroup';
  import { Panel } from '../Panel';

  import { INPUT_TYPE_OPTIONS } from './InputPanel.constants';
  import {
    FormFields,
    type InputForm,
    type InputPanelProps,
  } from './InputPanel.types';
  import { createInputPanelData, schema } from './InputPanel.utils';
  import { onMount } from 'svelte';

  let { node, onSave, onClose, onDismiss }: InputPanelProps = $props();

  const { form, errors, touched, data, setData } = createForm<InputForm>({
    extend: validator({ schema }),
    onSubmit: (values) => {
      if (!node) return;

      onSave(node.withUpdate(values, NodeStates.Ok));
    },
    // svelte-ignore state_referenced_locally
    initialValues: createInputPanelData(node?.data),
  });

  onMount(() => () => node && onDismiss?.(node));
</script>

<Panel.Root>
  <Panel.Header label="Leer variable">
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
        form="input-form"
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
      id="input-form"
      use:form
      class="flex h-full min-h-0 flex-col gap-4"
    >
      <div class="flex flex-col gap-4">
        <Input
          id={FormFields.Name}
          name={FormFields.Name}
          label="Nombre de la variable"
          placeholder="Nombre de la variable"
          value={$data[FormFields.Name]}
          error={!!$errors[FormFields.Name]}
          helper={$touched[FormFields.Name]
            ? $errors[FormFields.Name]
            : undefined}
          clearable
        />

        <RadioGroup
          name={FormFields.Type}
          label="Tipo de variable"
          options={INPUT_TYPE_OPTIONS}
          optionLabel="label"
          optionValue="value"
          error={!!$errors[FormFields.Type]}
          helper={$touched[FormFields.Type]
            ? $errors[FormFields.Type]
            : undefined}
          value={$data[FormFields.Type]}
          classNames={{
            radioContainer: 'grid grid-cols-2 gap-2',
            radioLabel: 'w-full rounded-md px-3 py-2',
          }}
        />
      </div>
    </form>
  </Panel.Content>
</Panel.Root>
