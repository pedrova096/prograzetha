<script lang="ts">
  import type { SidebarHeaderProps } from './Sidebar.types';

  let { children, class: className, ...props }: SidebarHeaderProps = $props();
</script>

<div {...props} class={['mb-4 flex items-center gap-2', className]}>
  {@render children?.()}
</div>
