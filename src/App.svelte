<script lang="ts">
  import 'tippy.js/dist/tippy.css';
  import { Diagram, Background, SidebarDrawer } from '~/lib/components';
  import { setGraphContext, setRuntimeContext } from './App.context.svelte';
  import { Router } from 'svelte-routing';
  import { Redo2, Undo2 } from 'lucide-svelte';
  import { Graph, HistoryAction } from './lib/modules/graph';
  import {
    setStorageAutoSaving,
    loadLocalProgramOnMount,
  } from './lib/modules/storage';

  const graph = new Graph();
  setGraphContext(graph);
  setStorageAutoSaving(graph);
  loadLocalProgramOnMount(graph);
  setRuntimeContext();

  let { history } = $derived(graph);

  const HISTORY_ACTION_MAP = {
    [HistoryAction.Redo]: graph.redo,
    [HistoryAction.Undo]: graph.undo,
  };

  const getHistoryActionFromEvent = (
    event: KeyboardEvent,
  ): HistoryAction | null => {
    const key = event.key.toLowerCase();
    if (!(event.ctrlKey || event.metaKey) || (key !== 'z' && key !== 'y')) {
      return null;
    }

    return event.shiftKey || key === 'y'
      ? HistoryAction.Redo
      : HistoryAction.Undo;
  };

  const onHistoryShortcut = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    if (
      target?.isContentEditable ||
      target?.matches('input, textarea, select')
    ) {
      return;
    }

    const action = getHistoryActionFromEvent(event);

    if (action === null) return;

    const actionFunction = HISTORY_ACTION_MAP[action];
    const changed = actionFunction();

    if (changed) event.preventDefault();
  };
</script>

<svelte:window onkeydown={onHistoryShortcut} />

<Router basepath={import.meta.env.BASE_URL}>
  <main class="flex h-screen gap-4 overflow-hidden p-4">
    <Background />

    <div
      class="relative flex flex-1 flex-col items-center gap-1 overflow-y-auto rounded-sm p-2"
    >
      <div
        class="sticky left-2 top-2 z-30 flex self-start rounded-md border border-zinc-200 bg-white p-1 shadow-sm"
      >
        <button
          type="button"
          aria-label="Deshacer"
          title="Deshacer (Ctrl/Cmd+Z)"
          disabled={!history.canUndo}
          class="rounded p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
          onclick={graph.undo}
        >
          <Undo2 class="size-4" />
        </button>
        <button
          type="button"
          aria-label="Rehacer"
          title="Rehacer (Ctrl/Cmd+Shift+Z)"
          disabled={!history.canRedo}
          class="rounded p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
          onclick={graph.redo}
        >
          <Redo2 class="size-4" />
        </button>
      </div>
      <Diagram />
    </div>

    <SidebarDrawer />
  </main>
</Router>
