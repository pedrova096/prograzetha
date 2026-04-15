<script lang="ts">
  import 'tippy.js/dist/tippy.css';
  import { Diagram, Background } from '~/lib/components';
  import { setDiagramContext } from './App.context.svelte';

  let { diagram } = setDiagramContext();
</script>

<main class="h-screen flex flex-col p-4overflow-y-hidden">
  <Background />
  <div
    class="flex-1 p-2 flex flex-col border border-red-300 rounded-sm gap-1 overflow-y-auto relative items-center"
  >
    <Diagram from={diagram.start} />
  </div>
</main>
