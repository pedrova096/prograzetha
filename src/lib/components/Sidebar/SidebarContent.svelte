<script lang="ts">
  import type { SidebarContentProps } from './Sidebar.types';

  let { children, class: className, ...props }: SidebarContentProps = $props();
</script>

<nav {...props} class={['flex flex-1 flex-col gap-1', className]}>
  {@render children?.()}
</nav>
