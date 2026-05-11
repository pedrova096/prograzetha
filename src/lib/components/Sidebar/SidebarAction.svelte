<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';
  import { getSidebarContext } from './Sidebar.context';
  import type { SidebarActionProps } from './Sidebar.types';

  let {
    icon: Icon,
    id,
    label,
    active = false,
    badge,
    panel,
    panelTitle,
    panelActions,
    defaultOpenPanel = false,
    onclick,
    class: className,
    ...props
  }: SidebarActionProps = $props();

  const sidebar = getSidebarContext();
  const collapsed = $derived(sidebar.getCollapsed());
  const currentActionId = $derived(sidebar.getActionId());
  const isActive = $derived(active || currentActionId === id);
  let openedDefaultPanel = $state(false);

  const createPanel = () => {
    if (!panel) return null;

    return {
      title: panelTitle ?? label,
      actions: panelActions,
      content: panel,
    };
  };

  $effect(() => {
    const nextPanel = createPanel();

    if (!nextPanel) return;

    return sidebar.registerPanel(id, nextPanel);
  });

  $effect(() => {
    if (!defaultOpenPanel) {
      openedDefaultPanel = false;
      return;
    }

    if (!panel || openedDefaultPanel || currentActionId) {
      return;
    }

    sidebar.setActionId(id);
    openedDefaultPanel = true;
  });

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (panel) {
      const isOpen = currentActionId === id;

      sidebar.setActionId(isOpen ? null : id);
    }

    onclick?.(event);
  };
</script>

<button
  {...props}
  type="button"
  title={collapsed ? label : undefined}
  aria-label={label}
  aria-expanded={panel ? isActive : undefined}
  data-active={isActive}
  class={[
    'flex h-9 w-full items-center gap-2 rounded-md px-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950',
    collapsed ? 'justify-center' : 'justify-start',
    isActive && 'bg-zinc-100 font-medium text-zinc-950',
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
