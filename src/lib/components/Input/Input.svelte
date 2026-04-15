<script lang="ts">
  import { Search, X } from 'lucide-svelte';
  import type { InputProps } from './Input.types';

  let {
    value = $bindable(''),
    placeholder = '',
    class: className,
    clearable = false,
    onClear,
    ...props
  }: InputProps = $props();

  const handleClear = () => {
    value = '';
    onClear?.();
  };
</script>

<div class="relative">
  <Search
    class="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none"
  />
  <input
    bind:value
    type="text"
    {placeholder}
    class={[
      'w-full pl-8 pr-8 py-2 text-sm rounded-lg',
      'bg-slate-50 border border-slate-200',
      'text-slate-700 placeholder:text-slate-400',
      'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400',
      'transition-all duration-150',
      className,
    ]}
    {...props}
  />
  {#if clearable && value}
    <button
      type="button"
      onclick={handleClear}
      class="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
    >
      <X class="size-3.5" />
    </button>
  {/if}
</div>
