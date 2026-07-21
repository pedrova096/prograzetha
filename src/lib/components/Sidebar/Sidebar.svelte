<script lang="ts">
  import { setSidebarContext } from './Sidebar.context';
  import type { SidebarPanel, SidebarRootProps } from './Sidebar.types';

  let {
    collapsed = $bindable(false),
    actionId = $bindable(null),
    children,
    class: className,
    ...props
  }: SidebarRootProps = $props();

  let panels = $state<Record<string, SidebarPanel>>({});
  const panel = $derived(actionId ? panels[actionId] : null);

  setSidebarContext({
    getCollapsed: () => collapsed,
    setCollapsed: (value) => (collapsed = value),
    toggleCollapsed: () => (collapsed = !collapsed),
    getActionId: () => actionId,
    setActionId: (value) => (actionId = value),
    registerPanel: (id, value) => {
      panels[id] = value;

      return () => {
        delete panels[id];
        if (actionId === id) actionId = null;
      };
    },
  });
</script>

<div
  {...props}
  class={['flex h-full min-h-0 items-stretch gap-2', className]}
  data-collapsed={collapsed}
  data-action={actionId ?? 'none'}
>
  {#if panel}
    <section
      class="flex min-w-72 flex-col rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
      aria-label={panel.title ?? 'Sidebar panel'}
    >
      {#if panel.title || panel.actions}
        <header class="flex items-center gap-3">
          {#if panel.title}
            <h2
              class="min-w-0 flex-1 truncate text-sm font-semibold text-zinc-900"
            >
              {panel.title}
            </h2>
          {:else}
            <div class="flex-1"></div>
          {/if}

          {@render panel.actions?.()}
        </header>
        <div
          role="separator"
          aria-orientation="horizontal"
          class="my-4 h-px bg-zinc-200"
        ></div>
      {/if}

      {@render panel.content()}
    </section>
  {/if}

  <aside
    class={[
      'relative flex shrink-0 flex-col rounded-lg border border-zinc-200 bg-white p-2 shadow-sm transition-[width] duration-200',
      collapsed ? 'w-14' : 'w-48',
    ]}
    aria-label="Sidebar"
  >
    {@render children()}
  </aside>
</div>
