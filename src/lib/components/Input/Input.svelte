<script lang="ts">
  import { X } from 'lucide-svelte';
  import type { InputProps } from './Input.types';

  let {
    ref = $bindable<HTMLInputElement | null>(null),
    value = $bindable(''),
    class: className,
    label,
    id,
    helper: helperProp,
    helperHint,
    startAdornment,
    error = false,
    clearable = false,
    onClear,
    ...rest
  }: InputProps = $props();

  const helper = $derived(
    Array.isArray(helperProp) ? helperProp.join(', ') : helperProp,
  );

  const onClearHandler = () => {
    value = '';
    onClear?.();
  };
</script>

<div class="flex w-full flex-col gap-1.5">
  {#if label}
    <label class="block text-sm font-medium text-zinc-700" for={id}>
      {label}
    </label>
  {/if}

  <div class="relative">
    {#if startAdornment}
      <div class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
        {@render startAdornment()}
      </div>
    {/if}

    <input
      bind:this={ref}
      bind:value
      {id}
      class={[
        'w-full px-3 py-2 text-sm rounded-lg transition-all duration-150',
        'bg-slate-50 border border-slate-200',
        'text-slate-700 placeholder:text-slate-400',
        'focus:outline-none focus:ring-2',
        error
          ? 'focus:ring-red-500/30 focus:border-red-400'
          : 'focus:ring-indigo-500/30 focus:border-indigo-400',
        startAdornment && 'pl-8',
        clearable && value && 'pr-8',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      ]}
      {...rest}
    />

    {#if clearable && value}
      <button
        type="button"
        onclick={onClearHandler}
        class="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
      >
        <X class="size-3.5" />
      </button>
    {/if}
  </div>

  {@render helperHint?.()}

  {#if helper}
    <p class={['text-sm', error ? 'text-red-500' : 'text-zinc-500']}>
      {helper}
    </p>
  {/if}
</div>
