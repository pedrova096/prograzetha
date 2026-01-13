<script lang="ts">
  import type { NodeProps } from './Node.types';

  let { id, type, x, y }: NodeProps = $props();
</script>

<div
  {id}
  class="flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-4 py-2 shadow-md transition-shadow hover:shadow-lg"
>
  <span class="text-sm font-medium text-gray-700">{type}</span>
</div>

<style>
</style>
