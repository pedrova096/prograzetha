<script lang="ts">
  import { default as Diagram } from './Diagram.svelte';
  import { Node } from '../Node';
  import type { DiagramProps } from './Diagram.types';

  let { nodes, edges, from }: DiagramProps = $props();

  let current = $derived(nodes.get(from));
  let next = $derived(current ? edges.get(current.id)?.to : undefined);
</script>

<div class="flex flex-col p-4">
  {#if current}
    <Node {...current} />
  {/if}
</div>

{#if next}
  <Diagram {nodes} {edges} from={next} />
{/if}
