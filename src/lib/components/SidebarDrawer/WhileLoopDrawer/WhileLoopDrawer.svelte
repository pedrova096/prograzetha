<script lang="ts">
  import { validator } from '@felte/validator-yup';
  import { createForm } from 'felte';
  import { Repeat, Save } from '@lucide/svelte';
  import { onMount } from 'svelte';

  import { NodeStates } from '~/lib/modules/nodes';
  import { Sidebar } from '../../Sidebar';
  import { ConditionalComposer } from '../ConditionalDrawer/ConditionalComposer';
  import { schema } from '../ConditionalDrawer/ConditionalDrawer.utils';
  import {
    FormFields,
    type WhileLoopDrawerForm,
    type WhileLoopDrawerProps,
  } from './WhileLoopDrawer.types';
  import {
    createWhileLoopDrawerData,
    createWhileLoopNodeData,
  } from './WhileLoopDrawer.utils';

  let { node, onSave, onClose, onDismiss }: WhileLoopDrawerProps = $props();

  const { form, data, setData, reset } = createForm<WhileLoopDrawerForm>({
    extend: validator({ schema }),
    onSubmit: (values) => {
      if (!node) return;

      onSave(node.withUpdate(createWhileLoopNodeData(values), NodeStates.Ok));
    },
    // svelte-ignore state_referenced_locally
    initialValues: createWhileLoopDrawerData(node),
  });

  $effect(() => {
    reset();
    setData(createWhileLoopDrawerData(node));
  });

  onMount(() => () => node && onDismiss?.(node));
</script>

<Sidebar.Action
  icon={Repeat}
  id="node-while-loop"
  label="Nodo"
  panelTitle="Mientras"
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
        form="while-loop-drawer-form"
        class="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800"
      >
        <Save class="size-3.5" />
        Guardar
      </button>
    </div>
  {/snippet}

  {#snippet panel()}
    <form
      id="while-loop-drawer-form"
      use:form
      class="flex h-full min-h-0 flex-col gap-4"
    >
      <p class="text-xs text-zinc-500">
        Repetir mientras la condición sea verdadera.
      </p>
      <ConditionalComposer
        name={FormFields.Conditions}
        bind:value={$data[FormFields.Conditions]}
      />
    </form>
  {/snippet}
</Sidebar.Action>
