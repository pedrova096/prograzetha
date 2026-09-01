<script lang="ts">
  import { getRuntimeContext } from '~/App.context.svelte';
  import { Panel } from '../Panel';
  import { EXECUTION_ICON_LABEL } from './ExecutionPanel.constants';
  import { ExecutionContent, ExecutionControls } from './ExecutionContent';
  import { ExecutionError } from './ExecutionError';

  let { runtimeState } = $derived(getRuntimeContext());
</script>

<Panel.Root>
  <Panel.Header {...EXECUTION_ICON_LABEL}>
    {#if runtimeState.kind === 'ready'}
      <ExecutionControls runtime={runtimeState.runtime} />
    {/if}
  </Panel.Header>
  <Panel.Divider />

  <Panel.Content>
    {#if runtimeState.kind === 'ready'}
      <ExecutionContent runtime={runtimeState.runtime} />
    {:else}
      <ExecutionError error={runtimeState.error} />
    {/if}
  </Panel.Content>
</Panel.Root>
