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
    'flex h-9 w-full items-center gap-2 rounded-md px-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950',
    collapsed ? 'justify-center' : 'justify-start',
    isActive && 'bg-zinc-100 font-medium text-zinc-950',
    className,
  ]}
>
  {#if Icon}
    <Icon class="size-4 shrink-0" />
  {/if}

  {#if !collapsed}
    <span class="min-w-0 flex-1 truncate text-left">{label}</span>
  {/if}
</Link>
