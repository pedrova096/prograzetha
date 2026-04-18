<script lang="ts" generics="T = string">
  import { Search } from 'lucide-svelte';
  import { getDropdownContext } from './Dropdown.context';
  import { getFilteredOptions } from './Dropdown.utils';
  import { Input } from '~/lib/components/Input';
  import type { ContentProps, DropdownOption } from './Dropdown.types';

  let {
    options = [],
    searchable = false,
    clearable = false,
    placeholder = 'Search...',
    emptyText = 'No results found',
  }: ContentProps<T> = $props();

  const { setContentRef, onSelect } = getDropdownContext();

  let searchQuery = $state('');

  const filteredOptions = $derived(
    getFilteredOptions(searchQuery, options as DropdownOption[]),
  );
</script>

<div
  bind:this={() => {}, setContentRef}
  class="min-w-48 p-2 bg-white rounded-xl shadow-xl border border-slate-100"
>
  {#if searchable}
    <div class="mb-2">
      <Input bind:value={searchQuery} {placeholder} {clearable} autofocus>
        {#snippet startAdornment()}
          <Search class="size-4 text-slate-400" />
        {/snippet}
      </Input>
    </div>
  {/if}

  <div class="max-h-64 overflow-y-auto">
    {#if filteredOptions.length === 0}
      <div class="px-3 py-4 text-center text-sm text-slate-400">
        {emptyText}
      </div>
    {:else}
      <ul class="space-y-0.5">
        {#each filteredOptions as option (option.value)}
          <li>
            <button
              type="button"
              onclick={(event) => onSelect(event, option)}
              disabled={option.disabled}
              class={[
                'w-full px-3 py-2 text-left text-sm rounded-lg transition-all duration-100',
                'flex items-center gap-2',
                option.disabled
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer',
              ]}
            >
              <span class="flex-1">{option.label}</span>
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
