<script lang="ts">
  import { Diagram } from './lib/Diagram';
  import { START_NODE, NODES, EDGES } from './App.mock';
</script>

<main class="flex flex-col p-4">
  <Diagram nodes={NODES} edges={EDGES} from={START_NODE.id} />
</main>
