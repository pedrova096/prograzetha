<script lang="ts">
  import type { PanelGroupProps } from './Panel.types';

  let { children, class: className, ...props }: PanelGroupProps = $props();
</script>

<div {...props} class={['flex flex-col gap-1', className]}>
  {@render children?.()}
</div>
