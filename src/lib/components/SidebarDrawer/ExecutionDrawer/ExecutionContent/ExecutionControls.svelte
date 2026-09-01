<script lang="ts">
  import { Pause, Play, RotateCcw, Square } from '@lucide/svelte';
  import { PlayerStatus } from '~/lib/modules/runtime';
  import type { ExecutionContentProps } from './ExecutionContent.types';

  let { runtime }: ExecutionContentProps = $props();

  const playProgram = () => {
    void runtime.play();
  };

  const pauseProgram = () => {
    runtime.pause();
  };

  const resetProgram = () => {
    runtime.stop();
  };
</script>

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
