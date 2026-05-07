<script lang="ts">
  import type { SidebarDividerProps } from './Sidebar.types';

  let { class: className, ...props }: SidebarDividerProps = $props();
</script>

<div
  {...props}
  role="separator"
  aria-orientation="horizontal"
  class={['my-2 h-px bg-zinc-200', className]}
></div>
