<script lang="ts">
  import { getSidebarContext } from './Sidebar.context';
  import type { SidebarItemProps } from './Sidebar.types';

  let {
    icon: Icon,
    label,
    active = false,
    badge,
    class: className,
    ...props
  }: SidebarItemProps = $props();

  const sidebar = getSidebarContext();
  const collapsed = $derived(sidebar.getCollapsed());
</script>

<button
  {...props}
  type="button"
  title={collapsed ? label : undefined}
  aria-label={label}
  data-active={active}
  class={[
    'flex h-9 w-full items-center gap-2 rounded-md px-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950',
    collapsed ? 'justify-center' : 'justify-start',
    active && 'bg-zinc-100 font-medium text-zinc-950',
    className,
  ]}
>
  {#if Icon}
    <Icon class="size-4 shrink-0" />
  {/if}

  {#if !collapsed}
    <span class="min-w-0 flex-1 truncate text-left">{label}</span>

    {#if badge !== undefined}
      <span
        class="rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-700"
      >
        {badge}
      </span>
    {/if}
  {/if}
</button>
