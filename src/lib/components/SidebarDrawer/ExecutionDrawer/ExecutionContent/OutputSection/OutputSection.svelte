<script lang="ts">
  import { RuntimeEvents } from '~/lib/modules/runtime';

  import type { OutputSectionProps } from './OutputSection.types';

  let { events }: OutputSectionProps = $props();
</script>

<section class="flex min-h-0 flex-1 flex-col gap-2" aria-label="Salida">
  <h3 class="text-xs font-semibold uppercase text-zinc-500">Salida</h3>
  <div
    class="min-h-24 flex-1 overflow-y-auto rounded-md border border-zinc-200 bg-white p-3 text-sm text-zinc-700"
  >
    {#if events.length}
      <div class="flex flex-col gap-2">
        {#each events as event}
          {#if event.type === RuntimeEvents.ActionAlert}
            <p class="break-words">{event.message || '(vacía)'}</p>
          {/if}
        {/each}
      </div>
    {:else}
      <p class="text-zinc-400">Sin salida todavía.</p>
    {/if}
  </div>
</section>
