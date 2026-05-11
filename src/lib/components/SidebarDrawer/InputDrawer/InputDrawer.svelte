<script lang="ts">
  import { validator } from '@felte/validator-yup';
  import { createForm } from 'felte';
  import { GitCommitVertical, Save } from 'lucide-svelte';

  import { Input } from '../../Input';
  import { RadioGroup } from '../../RadioGroup';
  import { Sidebar } from '../../Sidebar';

  import { INPUT_TYPE_OPTIONS } from './InputDrawer.constants';
  import {
    FormFields,
    type InputDrawerForm,
    type InputDrawerProps,
  } from './InputDrawer.types';
  import { createInputDrawerData, schema } from './InputDrawer.utils';

  let { node, onSave, onClose }: InputDrawerProps = $props();

  const { form, errors, touched, data, setData } = createForm<InputDrawerForm>({
    extend: validator({ schema }),
    onSubmit: (values) => {
      if (!node) return;

      onSave(node.withUpdate(values));
    },
    // svelte-ignore state_referenced_locally
    initialValues: createInputDrawerData(node?.data),
  });

  $effect(() => {
    setData(createInputDrawerData(node?.data));
  });
</script>

<Sidebar.Action
  icon={GitCommitVertical}
  id="node-input"
  label="Nodo"
  panelTitle="Leer variable"
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
        form="input-drawer-form"
        class="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800"
      >
        <Save class="size-3.5" />
        Guardar
      </button>
    </div>
  {/snippet}

  {#snippet panel()}
    <form
      id="input-drawer-form"
      use:form
      class="flex h-full min-h-0 flex-col gap-4"
    >
      <div class="flex flex-col gap-4">
        <Input
          id={FormFields.Variable}
          name={FormFields.Variable}
          label="Nombre de la variable"
          placeholder="Nombre de la variable"
          value={$data[FormFields.Variable]}
          error={!!$errors[FormFields.Variable]}
          helper={$touched[FormFields.Variable]
            ? $errors[FormFields.Variable]
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
  {/snippet}
</Sidebar.Action>
