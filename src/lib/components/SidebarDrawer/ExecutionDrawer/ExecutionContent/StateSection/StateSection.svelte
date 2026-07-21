<script lang="ts">
  import type { StateSectionProps } from './StateSection.types';

  let { statusLabel }: StateSectionProps = $props();
</script>

<section class="flex flex-col gap-2" aria-label="Estado de ejecución">
  <div class="flex items-center justify-between gap-3">
    <div class="min-w-0">
      <p class="text-xs font-medium text-zinc-500">Estado</p>
      <p class="truncate text-sm font-semibold text-zinc-950">
        {statusLabel}
      </p>
    </div>
  </div>
</section>
