<script lang="ts">
  import { PlayerStatus, RuntimeEvents } from '~/lib/modules/runtime';
  import { EventsSection } from './EventsSection';
  import { ExecutionError } from '../ExecutionError';
  import { OutputSection } from './OutputSection';
  import { StateSection } from './StateSection';
  import { VariablesSection } from './VariablesSection';
  import type { ExecutionContentProps } from './ExecutionContent.types';

  let { runtime }: ExecutionContentProps = $props();

  const statusLabel = $derived(
    {
      [PlayerStatus.Idle]: 'Listo',
      [PlayerStatus.Running]: 'Ejecutando',
      [PlayerStatus.Paused]: 'Pausado',
      [PlayerStatus.WaitingInput]: 'Esperando entrada',
      [PlayerStatus.Done]: 'Finalizado',
      [PlayerStatus.Error]: 'Error',
    }[runtime.status],
  );
  const outputEvents = $derived(
    runtime.events.filter((event) => event.type === RuntimeEvents.ActionAlert),
  );
  const variables = $derived(Object.entries(runtime.context.variables));
  const recentEvents = $derived(runtime.events.slice(-12).reverse());

  const sectionDividerClass = 'border-zinc-200';
</script>

{#if runtime.status === PlayerStatus.Error && runtime.error}
  <ExecutionError error={runtime.error} />
{:else}
  <div class="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
    <StateSection {statusLabel} />

    <hr class={sectionDividerClass} />

    <OutputSection events={outputEvents} />

    <hr class={sectionDividerClass} />

    <VariablesSection {variables} />

    <hr class={sectionDividerClass} />

    <EventsSection events={recentEvents} />
  </div>
{/if}
