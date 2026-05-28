<script lang="ts" generics="T = string">
  import { Search } from 'lucide-svelte';
  import { getDropdownContext } from './Dropdown.context';
  import { getFilteredOptions } from './Dropdown.utils';
  import { Input } from '~/lib/components/Input';
  import DropdownItem from './DropdownItem.svelte';
  import type { ContentProps } from './Dropdown.types';

  let {
    options = [],
    searchable = false,
    clearable = false,
    placeholder = 'Search...',
    emptyText = 'No results found',
  }: ContentProps<T> = $props();

  const { setContentRef } = getDropdownContext();

  let searchQuery = $state('');

  const filteredOptions = $derived(getFilteredOptions(searchQuery, options));
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
          <DropdownItem
            value={option.value}
            label={option.label}
            icon={option.icon}
            onclick={option.onclick}
            disabled={option.disabled}
          />
        {/each}
      </ul>
    {/if}
  </div>
</div>
