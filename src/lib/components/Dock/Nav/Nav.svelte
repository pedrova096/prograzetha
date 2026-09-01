<script lang="ts">
  import { setNavContext } from './Nav.context';
  import type { NavRootProps } from './Nav.types';

  let {
    collapsed = $bindable(false),
    pathname = $bindable(''),
    actionId = $bindable(null),
    children,
    class: className,
    ...props
  }: NavRootProps = $props();

  setNavContext({
    getCollapsed: () => collapsed,
    getPathname: () => pathname,
    setCollapsed: (value) => (collapsed = value),
    toggleCollapsed: () => (collapsed = !collapsed),
  });
</script>

<nav
  {...props}
  data-collapsed={collapsed}
  data-action={actionId ?? 'none'}
  class={[
    'relative flex shrink-0 flex-col rounded-lg border border-zinc-200 bg-slate-50 p-2 shadow-sm transition-[width,min-width] duration-200',
    collapsed ? 'w-14 min-w-14' : 'w-52 min-w-52',
    className,
  ]}
>
  {@render children?.()}
</nav>
