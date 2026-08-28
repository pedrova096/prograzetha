<script lang="ts">
  import type { ToggleProps } from './Toggle.types';

  let {
    checked = $bindable(false),
    class: className,
    label,
    ...restProps
  }: ToggleProps = $props();
</script>

<label
  class={[
    'flex cursor-pointer items-center justify-between gap-3 text-sm',
    className,
  ]}
>
  {#if label}
    <span class="font-medium text-zinc-700">{label}</span>
  {/if}

  <input type="checkbox" bind:checked class="peer sr-only" {...restProps} />
  <span
    class={[
      'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent transition-colors',
      'bg-zinc-200 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-zinc-400 peer-focus-visible:ring-offset-2',
      'peer-checked:bg-zinc-900',
    ]}
    aria-hidden="true"
  >
    <span
      class={[
        'pointer-events-none block size-5 rounded-full bg-white shadow-sm transition-transform',
        checked ? 'translate-x-5' : 'translate-x-0',
      ]}
    ></span>
  </span>
</label>
