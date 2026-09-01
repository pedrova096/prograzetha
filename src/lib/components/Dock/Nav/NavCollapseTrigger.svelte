<script lang="ts">
  import { ChevronLeft, ChevronRight } from '@lucide/svelte';
  import type { MouseEventHandler } from 'svelte/elements';
  import { getNavContext } from './Nav.context';
  import type { NavCollapseTriggerProps } from './Nav.types';

  let {
    label = 'Alternar navegación',
    class: className,
    onclick,
    ...props
  }: NavCollapseTriggerProps = $props();

  const nav = getNavContext();
  const collapsed = $derived(nav.getCollapsed());

  const onClickHandler: MouseEventHandler<HTMLButtonElement> = (event) => {
    nav.toggleCollapsed();
    onclick?.(event);
  };
</script>

<button
  {...props}
  type="button"
  aria-label={label}
  aria-expanded={!collapsed}
  class={[
    'absolute -left-3 top-8 flex size-6 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-900',
    className,
  ]}
  onclick={onClickHandler}
>
  {#if collapsed}
    <ChevronRight class="size-3.5" />
  {:else}
    <ChevronLeft class="size-3.5" />
  {/if}
</button>
