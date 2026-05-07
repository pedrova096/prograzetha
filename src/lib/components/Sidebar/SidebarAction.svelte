<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';
  import { getSidebarContext } from './Sidebar.context';
  import type { SidebarActionProps } from './Sidebar.types';

  let {
    icon: Icon,
    label,
    active = false,
    badge,
    panel,
    panelTitle,
    onclick,
    class: className,
    ...props
  }: SidebarActionProps = $props();

  const sidebar = getSidebarContext();
  const collapsed = $derived(sidebar.getCollapsed());
  const currentPanel = $derived(sidebar.getPanel());
  const selected = $derived(active || currentPanel?.id === label);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (panel) {
      sidebar.setPanel(
        currentPanel?.id === label
          ? null
          : {
              id: label,
              title: panelTitle ?? label,
              content: panel,
            },
      );
    }

    onclick?.(event);
  };
</script>

<button
  {...props}
  type="button"
  title={collapsed ? label : undefined}
  aria-label={label}
  aria-expanded={panel ? selected : undefined}
  data-active={selected}
  class={[
    'flex h-9 w-full items-center gap-2 rounded-md px-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950',
    collapsed ? 'justify-center' : 'justify-start',
    selected && 'bg-zinc-100 font-medium text-zinc-950',
    className,
  ]}
  onclick={handleClick}
>
  {#if Icon}
    <Icon class="size-4 shrink-0" />
  {/if}

  {#if !collapsed}
    <span class="min-w-0 flex-1 truncate text-left">{label}</span>

    {#if badge !== undefined}
      <span
        class="rounded bg-orange-100 px-1.5 py-0.5 text-xs font-medium text-orange-700"
      >
        {badge}
      </span>
    {/if}
  {/if}
</button>
