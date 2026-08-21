<script lang="ts">
  import { CircleDot } from 'lucide-svelte';

  import { RuntimeEvents, type RuntimeEvent } from '~/lib/modules/runtime';

  import { ID_MAX_LENGTH } from './EventsSection.constants';
  import type { EventsSectionProps } from './EventsSection.types';

  let { events }: EventsSectionProps = $props();

  const getEventLabel = (event: RuntimeEvent) => {
    switch (event.type) {
      case RuntimeEvents.NodeProcess:
        return `Procesa ${event.nodeId.slice(0, ID_MAX_LENGTH)}`;

      case RuntimeEvents.EdgeTraverse:
        return `${event.from.slice(0, ID_MAX_LENGTH)} → ${event.to.slice(0, ID_MAX_LENGTH)}`;

      case RuntimeEvents.BranchChoose:
        return `${event.nodeId.slice(0, ID_MAX_LENGTH)} toma ${event.branch}`;

      case RuntimeEvents.LoopCheck:
        return event.continues
          ? `${event.nodeId.slice(0, ID_MAX_LENGTH)} repite (${event.iteration + 1})`
          : `${event.nodeId.slice(0, ID_MAX_LENGTH)} termina`;

      case RuntimeEvents.ActionAlert:
        return `Salida: ${event.message || '(vacía)'}`;

      case RuntimeEvents.ActionInput:
        return `Entrada: ${event.variable}`;

      case RuntimeEvents.ContextUpdate:
        return 'Variables actualizadas';

      case RuntimeEvents.ExecutionEnd:
        return 'Ejecución finalizada';
    }
  };
</script>

<section class="flex min-h-0 flex-1 flex-col gap-2" aria-label="Eventos">
  <header class="flex justify-between items-center">
    <h3 class="text-xs font-semibold uppercase text-zinc-500">Eventos</h3>
    <span
      class="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-600"
    >
      <CircleDot class="size-3" />
      {events.length}
    </span>
  </header>
  <div class="min-h-28 overflow-y-auto rounded-md border border-zinc-200">
    {#if events.length}
      {#each events as event}
        <div class="border-b border-zinc-100 px-3 py-2 last:border-b-0">
          <p class="text-xs font-medium text-zinc-700">
            {getEventLabel(event)}
          </p>
          <p class="mt-0.5 text-[11px] text-zinc-400">{event.type}</p>
        </div>
      {/each}
    {:else}
      <p class="px-3 py-2 text-sm text-zinc-400">Sin eventos.</p>
    {/if}
  </div>
</section>
