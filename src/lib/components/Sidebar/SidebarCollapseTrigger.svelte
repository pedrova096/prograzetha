<script lang="ts">
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';
  import { getSidebarContext } from './Sidebar.context';
  import type { SidebarCollapseTriggerProps } from './Sidebar.types';
  import type { MouseEventHandler } from 'svelte/elements';

  let {
    label = 'Toggle sidebar',
    class: className,
    onclick,
    ...props
  }: SidebarCollapseTriggerProps = $props();

  const sidebar = getSidebarContext();
  const collapsed = $derived(sidebar.getCollapsed());

  const onClickHandler: MouseEventHandler<HTMLButtonElement> = (event) => {
    sidebar.toggleCollapsed();
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
