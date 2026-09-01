<script lang="ts">
  import { CircleAlert } from '@lucide/svelte';
  import type { ExecutionErrorProps } from './ExecutionError.types';

  let { error }: ExecutionErrorProps = $props();
</script>

<section
  class="flex flex-col gap-3 rounded-md border border-red-200 bg-red-50 p-3"
  role="alert"
  aria-label="Error de ejecución"
>
  <div class="flex items-center gap-2 text-sm font-semibold text-red-900">
    <CircleAlert class="size-4" />
    No se puede ejecutar el programa.
  </div>
  <p class="break-words text-sm text-red-800">{error.message}</p>
</section>
