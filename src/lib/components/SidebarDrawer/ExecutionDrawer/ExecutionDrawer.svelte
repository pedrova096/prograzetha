<script lang="ts">
  import { Activity, Pause, Play, RotateCcw, Square } from 'lucide-svelte';

  import { getRuntimeContext } from '~/App.context.svelte';
  import { PlayerStatus, RuntimeEvents } from '~/lib/modules/runtime';
  import { Sidebar } from '../../Sidebar';
  import { EventsSection } from './EventsSection';
  import { OutputSection } from './OutputSection';
  import { StateSection } from './StateSection';
  import { VariablesSection } from './VariablesSection';
  import type { ExecutionDrawerProps } from './ExecutionDrawer.types';

  let {
    active = false,
    defaultOpenPanel = false,
    onclick,
  }: ExecutionDrawerProps = $props();

  let { runtime } = $derived(getRuntimeContext());

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

  const playProgram = () => {
    void runtime.play();
  };

  const pauseProgram = () => {
    runtime.pause();
  };

  const resetProgram = () => {
    runtime.stop();
  };

  const sectionDividerClass = 'border-zinc-200';
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
  {#snippet panelActions()}
    <div class="flex items-center gap-1">
      {#if runtime.status === PlayerStatus.Running}
        <button
          type="button"
          class="inline-flex size-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          aria-label="Pausar"
          onclick={pauseProgram}
        >
          <Pause class="size-4" />
        </button>
      {:else}
        <button
          type="button"
          class="inline-flex size-8 items-center justify-center rounded-md bg-zinc-900 text-white transition-colors hover:bg-zinc-800"
          aria-label="Ejecutar"
          onclick={playProgram}
        >
          <Play class="size-4" />
        </button>
      {/if}

      <button
        type="button"
        class="inline-flex size-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
        aria-label="Reiniciar"
        onclick={resetProgram}
      >
        {#if runtime.status === PlayerStatus.Running}
          <Square class="size-4" />
        {:else}
          <RotateCcw class="size-4" />
        {/if}
      </button>
    </div>
  {/snippet}

  {#snippet panel()}
    <div class="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      <StateSection {statusLabel} />

      <hr class={sectionDividerClass} />

      <OutputSection events={outputEvents} />

      <hr class={sectionDividerClass} />

      <VariablesSection {variables} />

      <hr class={sectionDividerClass} />

      <EventsSection events={recentEvents} />
    </div>
  {/snippet}
</Sidebar.Action>
