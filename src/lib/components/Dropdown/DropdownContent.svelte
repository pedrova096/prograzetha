<script lang="ts" generics="T = string">
  import { Search } from 'lucide-svelte';
  import { getDropdownContext } from './Dropdown.context';
  import {
    getFilteredEntries,
    isDropdownOptionGroup,
  } from './Dropdown.utils';
  import { Input } from '~/lib/components/Input';
  import DropdownGroup from './DropdownGroup.svelte';
  import DropdownItem from './DropdownItem.svelte';
  import DropdownLabel from './DropdownLabel.svelte';
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

  const filteredEntries = $derived(getFilteredEntries(searchQuery, options));
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

  <div class="max-h-64 space-y-1 overflow-y-auto" role="menu">
    {#if filteredEntries.length === 0}
      <div class="px-3 py-4 text-center text-sm text-slate-400">
        {emptyText}
      </div>
    {:else}
      {#each filteredEntries as entry}
        {#if isDropdownOptionGroup(entry)}
          <DropdownGroup>
            {#if entry.label}
              <DropdownLabel>{entry.label}</DropdownLabel>
            {/if}

            {#each entry.options as option (option.value)}
              <DropdownItem {...option} />
            {/each}
          </DropdownGroup>
        {:else}
          <DropdownItem {...entry} />
        {/if}
      {/each}
    {/if}
  </div>
</div>
