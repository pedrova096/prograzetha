<script lang="ts">
  import { setSidebarContext } from './Sidebar.context';
  import type { SidebarRootProps } from './Sidebar.types';

  let {
    collapsed = $bindable(false),
    panel = $bindable(null),
    children,
    class: className,
    ...props
  }: SidebarRootProps = $props();

  setSidebarContext({
    getCollapsed: () => collapsed,
    setCollapsed: (value) => (collapsed = value),
    toggleCollapsed: () => (collapsed = !collapsed),
    getPanel: () => panel,
    setPanel: (value) => (panel = value),
  });
</script>

<div
  {...props}
  class={['flex h-full min-h-0 items-stretch gap-2', className]}
  data-collapsed={collapsed}
>
  {#if panel}
    <section
      class="min-w-64 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
      aria-label={panel.title ?? 'Sidebar panel'}
    >
      {#if panel.title}
        <h2 class="mb-3 text-sm font-semibold text-zinc-900">{panel.title}</h2>
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
