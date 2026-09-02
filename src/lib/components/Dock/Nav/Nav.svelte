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
    'relative flex w-full min-w-0 shrink-0 flex-row items-center rounded-lg border border-zinc-200 bg-slate-50 p-2 shadow-sm transition-[width,min-width] duration-200 md:flex-col md:items-stretch',
    collapsed ? 'md:w-14 md:min-w-14' : 'md:w-52 md:min-w-52',
    className,
  ]}
>
  {@render children?.()}
</nav>
