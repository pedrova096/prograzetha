<script lang="ts">
  import type { PanelDividerProps } from './Panel.types';

  let { class: className, ...props }: PanelDividerProps = $props();
</script>

<div
  {...props}
  role="separator"
  aria-orientation="horizontal"
  class={['my-2 h-px bg-zinc-200', className]}
></div>
