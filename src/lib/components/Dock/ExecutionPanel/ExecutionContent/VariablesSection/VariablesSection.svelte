<script lang="ts">
  import type { VariablesSectionProps } from './VariablesSection.types';

  let { variables }: VariablesSectionProps = $props();

  const formatValue = (value: unknown) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'undefined') return 'undefined';
    return JSON.stringify(value);
  };

  const getValueTypeLabel = (value: unknown) => {
    if (value === null) return 'Nulo';
    if (Array.isArray(value)) return 'Lista';

    switch (typeof value) {
      case 'string': return 'Texto';
      case 'number': return 'Número';
      case 'boolean': return 'Booleano';
      case 'undefined': return 'Indefinido';
      case 'object': return 'Objeto';
      default: return typeof value;
    }
  };
</script>

<section class="flex flex-col gap-2" aria-label="Variables">
  <h3 class="text-xs font-semibold uppercase text-zinc-500">Variables</h3>
  <div class="overflow-hidden rounded-md border border-zinc-200">
    {#if variables.length}
      <div class="max-h-40 overflow-y-auto">
        <table class="w-full table-fixed max-w-72 border-collapse text-left">
          <thead class="sticky top-0 bg-zinc-50 text-[11px] uppercase text-zinc-500">
            <tr>
              <th class="w-2/5 px-3 py-2 font-semibold">Variable</th>
              <th class="w-24 px-3 py-2 font-semibold">Tipo</th>
              <th class="px-3 py-2 font-semibold">Valor</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            {#each variables as [name, value]}
              <tr>
                <td class="truncate px-3 py-2 text-xs font-medium text-zinc-500">{name}</td>
                <td class="px-3 py-2">
                  <span class="inline-flex rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[0.65rem] font-medium text-zinc-600">
                    {getValueTypeLabel(value)}
                  </span>
                </td>
                <td class="truncate px-3 py-2 text-xs text-zinc-900">{formatValue(value)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <p class="px-3 py-2 text-sm text-zinc-400">Sin variables.</p>
    {/if}
  </div>
</section>
