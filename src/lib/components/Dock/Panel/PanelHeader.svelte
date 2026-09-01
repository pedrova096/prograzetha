<script lang="ts">
  import type { PanelHeaderProps } from './Panel.types';

  let {
    icon: Icon,
    label,
    children,
    class: className,
    ...props
  }: PanelHeaderProps = $props();
</script>

<header {...props} class={['flex items-center gap-2', className]}>
  {#if label}
    {#if Icon}
      <Icon class="size-4 inline-flex" />
    {/if}
    <h2 class="min-w-0 flex-1 truncate text-sm font-semibold text-zinc-900">
      {label}
    </h2>
  {/if}
  {@render children?.()}
</header>
