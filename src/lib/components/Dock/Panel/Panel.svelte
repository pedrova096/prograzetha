<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();
</script>

<nav
  class="flex min-w-72 flex-col rounded-lg border border-zinc-200 bg-slate-50 p-4 shadow-sm h-full"
>
  {@render children?.()}
</nav>
