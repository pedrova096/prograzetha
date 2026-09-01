<script lang="ts">
  import { validator } from '@felte/validator-yup';
  import { createForm } from 'felte';
  import { GitCommitVertical, Save } from '@lucide/svelte';
  import { onMount } from 'svelte';

  import { Sidebar } from '../../Sidebar';
  import {
    FormFields,
    type ConditionalDrawerForm,
    type ConditionalDrawerProps,
  } from './ConditionalDrawer.types';
  import {
    createConditionDrawerData,
    normalizeConditions,
    schema,
  } from './ConditionalDrawer.utils';
  import { ConditionalComposer } from './ConditionalComposer';
  import { NodeStates } from '~/lib/modules/nodes';

  let { node, onSave, onClose, onDismiss }: ConditionalDrawerProps = $props();

  const { form, data, setData, reset } = createForm<ConditionalDrawerForm>({
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
    initialValues: createConditionDrawerData(node?.data),
  });

  $effect(() => {
    // Re-initialize
    reset();
    setData(createConditionDrawerData(node?.data));
  });

  onMount(() => () => node && onDismiss?.(node));
</script>

<Sidebar.Action
  icon={GitCommitVertical}
  id="node-condition"
  label="Nodo"
  panelTitle="Condición"
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
        form="conditional-drawer-form"
        class="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800"
      >
        <Save class="size-3.5" />
        Guardar
      </button>
    </div>
  {/snippet}

  {#snippet panel()}
    <form
      id="conditional-drawer-form"
      use:form
      class="flex h-full min-h-0 flex-col gap-4"
    >
      <ConditionalComposer
        name={FormFields.Conditions}
        bind:value={$data[FormFields.Conditions]}
      />
    </form>
  {/snippet}
</Sidebar.Action>
