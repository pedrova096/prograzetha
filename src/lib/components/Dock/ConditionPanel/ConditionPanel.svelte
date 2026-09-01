<script lang="ts">
  import { validator } from '@felte/validator-yup';
  import { createForm } from 'felte';
  import { GitCommitVertical, Save } from '@lucide/svelte';
  import { onMount } from 'svelte';

  import { Panel } from '../Panel';
  import {
    FormFields,
    type ConditionForm,
    type ConditionPanelProps,
  } from './ConditionPanel.types';
  import {
    createConditionPanelData,
    normalizeConditions,
    schema,
  } from './ConditionPanel.utils';
  import { ConditionalComposer } from './ConditionalComposer';
  import { NodeStates } from '~/lib/modules/nodes';

  let { node, onSave, onClose, onDismiss }: ConditionPanelProps = $props();

  const { form, data, setData, reset } = createForm<ConditionForm>({
    extend: validator({ schema }),
    onSubmit: (values) => {
      if (!node) return;

      onSave(
        node.withUpdate(
          {
            ...values,
            [FormFields.Conditions]: normalizeConditions(
              values[FormFields.Conditions],
            ),
          },
          NodeStates.Ok,
        ),
      );
    },
    // svelte-ignore state_referenced_locally
    initialValues: createConditionPanelData(node?.data),
  });

  $effect(() => {
    // Re-initialize
    reset();
    setData(createConditionPanelData(node?.data));
  });

  onMount(() => () => node && onDismiss?.(node));
</script>

<Panel.Root>
  <Panel.Header label="Condición">
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
        form="conditional-form"
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
      id="conditional-form"
      use:form
      class="flex h-full min-h-0 flex-col gap-4"
    >
      <ConditionalComposer
        name={FormFields.Conditions}
        bind:value={$data[FormFields.Conditions]}
      />
    </form>
  </Panel.Content>
</Panel.Root>
