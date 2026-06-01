<script lang="ts">
  import { validator } from '@felte/validator-yup';
  import { createForm } from 'felte';
  import { GitCommitVertical, Save } from 'lucide-svelte';

  import { getDiagramContext } from '~/App.context.svelte';
  import { NodeStates } from '~/lib/modules/nodes';
  import { Sidebar } from '../../Sidebar';

  import {
    createOutputDrawerData,
    getPreviousVariables,
    schema,
  } from './OutputDrawer.utils';
  import {
    FormFields,
    type OutputDrawerForm,
    type OutputDrawerProps,
  } from './OutputDrawer.types';
  import MentionInput from '../../MentionInput/MentionInput.svelte';
  import { LITERAL_VARIANT_MAP } from '~/lib/constants';
  import { onMount } from 'svelte';

  let { node, onSave, onClose, onDismiss }: OutputDrawerProps = $props();

  let {
    diagram: { nodes, edges },
  } = $derived(getDiagramContext());

  let options = $derived.by(() => {
    if (!node) return [];
    const variables = getPreviousVariables({ nodes, edges }, node);

    return variables.map((variable) => {
      const variant = variable.type;
      const meta = LITERAL_VARIANT_MAP[variant];

      return {
        value: `${variable.name}`,
        label: `${variable.name}`,
        type: variant,
        icon: meta.svg,
        colorClass: meta.class,
        detail: meta.label,
      };
    });
  });

  const { form, errors, touched, data, setData, setFields } =
    createForm<OutputDrawerForm>({
      extend: validator({ schema }),
      onSubmit: (values) => {
        if (!node) return;

        onSave(node.withUpdate(values, NodeStates.Ok));
      },
      // svelte-ignore state_referenced_locally
      initialValues: createOutputDrawerData(node?.data),
    });

  $effect(() => {
    setData(createOutputDrawerData(node?.data));
  });

  onMount(() => () => node && onDismiss?.(node));
</script>

<Sidebar.Action
  icon={GitCommitVertical}
  id="node-output"
  label="Nodo"
  panelTitle="Salida"
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
        form="output-drawer-form"
        class="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800"
      >
        <Save class="size-3.5" />
        Guardar
      </button>
    </div>
  {/snippet}

  {#snippet panel()}
    <form
      id="output-drawer-form"
      use:form
      class="flex h-full min-h-0 flex-col gap-4"
    >
      <MentionInput
        name={FormFields.Text}
        label="Texto"
        placeholder="Texto"
        error={!!$errors[FormFields.Text]}
        helper={$touched[FormFields.Text]
          ? $errors[FormFields.Text]
          : undefined}
        bind:value={
          () => $data[FormFields.Text] || '',
          (value) => setFields(FormFields.Text, value)
        }
        {options}
      />
    </form>
  {/snippet}
</Sidebar.Action>
