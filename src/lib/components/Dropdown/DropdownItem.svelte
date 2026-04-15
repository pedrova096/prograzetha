<script lang="ts" generics="T = string">
  import { getDropdownContext } from './Dropdown.context';
  import type { ItemProps } from './Dropdown.types';

  let { value, label, disabled = false, children }: ItemProps<T> = $props();

  const { onSelect } = getDropdownContext<T>();
</script>

<li>
  <button
    type="button"
    onclick={(event) => onSelect(event, { value, label })}
    {disabled}
    class={[
      'w-full px-3 py-2 text-left text-sm rounded-lg transition-all duration-100',
      'flex items-center gap-2',
      disabled
        ? 'text-slate-300 cursor-not-allowed'
        : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer',
    ]}
  >
    {#if children}
      {@render children()}
    {:else}
      <span class="flex-1">{label}</span>
    {/if}
  </button>
</li>
