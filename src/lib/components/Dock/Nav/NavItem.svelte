<script lang="ts">
  import { getNavContext } from './Nav.context';
  import type { NavItemProps } from './Nav.types';
  import { withBasePath } from '~/utils/navigation';
  import { Link } from 'svelte-routing';
  let {
    icon: Icon,
    to: toFromProps,
    label,
    active = false,
    class: className,
    ...props
  }: NavItemProps = $props();

  const navContext = $derived(getNavContext());
  const collapsed = $derived(navContext.getCollapsed());
  const pathname = $derived(navContext.getPathname());
  const to = $derived(withBasePath(toFromProps));
  const isActive = $derived(active || pathname === toFromProps);
</script>

<Link
  {...props}
  {to}
  title={collapsed ? label : undefined}
  aria-label={label}
  aria-expanded={isActive}
  data-active={isActive}
  class={[
    'flex h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-md px-1 text-[11px] text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 md:h-9 md:w-full md:flex-none md:flex-row md:gap-2 md:px-2 md:text-sm',
    collapsed ? 'md:justify-center' : 'md:justify-start',
    isActive && 'bg-zinc-100 font-medium text-zinc-950',
    className,
  ]}
>
  {#if Icon}
    <Icon class="size-4 shrink-0" />
  {/if}

  <span
    class={[
      'min-w-0 max-w-full truncate text-center md:flex-1 md:text-left',
      collapsed && 'md:hidden',
    ]}>{label}</span
  >
</Link>
