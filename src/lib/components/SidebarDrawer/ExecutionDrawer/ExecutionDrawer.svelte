<script lang="ts">
  import { Activity } from 'lucide-svelte';

  import { getRuntimeContext } from '~/App.context.svelte';
  import { Sidebar } from '../../Sidebar';
  import { ExecutionContent, ExecutionControls } from './ExecutionContent';
  import { ExecutionError } from './ExecutionError';
  import type { ExecutionDrawerProps } from './ExecutionDrawer.types';

  let {
    active = false,
    defaultOpenPanel = false,
    onclick,
  }: ExecutionDrawerProps = $props();

  let { runtimeState } = $derived(getRuntimeContext());
</script>

<Sidebar.Action
  icon={Activity}
  id="execution"
  label="Ejecutar"
  panelTitle="Ejecución"
  {active}
  {defaultOpenPanel}
  {onclick}
>
  {#snippet panel()}
    {#if runtimeState.kind === 'ready'}
      <ExecutionControls runtime={runtimeState.runtime} />
      <ExecutionContent runtime={runtimeState.runtime} />
    {:else}
      <ExecutionError error={runtimeState.error} />
    {/if}
  {/snippet}
</Sidebar.Action>
