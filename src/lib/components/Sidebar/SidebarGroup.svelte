<script lang="ts">
  import type { SidebarGroupProps } from './Sidebar.types';

  let { children, class: className, ...props }: SidebarGroupProps = $props();
</script>

<div {...props} class={['flex flex-col gap-1', className]}>
  {@render children?.()}
</div>
