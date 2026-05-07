<script lang="ts">
  import 'tippy.js/dist/tippy.css';
  import { Diagram, Background, SidebarDrawer } from '~/lib/components';
  import { setDiagramContext } from './App.context.svelte';

  setDiagramContext();
</script>

<main class="flex h-screen gap-4 overflow-hidden p-4">
  <Background />

  <div
    class="relative flex flex-1 flex-col items-center gap-1 overflow-y-auto rounded-sm border border-red-300 p-2"
  >
    <Diagram />
  </div>

  <SidebarDrawer />
</main>
