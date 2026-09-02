<script lang="ts">
  import type { PanelGroupProps } from '../Panel/Panel.types';

  let { children, class: className, ...props }: PanelGroupProps = $props();
</script>

<div
  {...props}
  class={['contents md:mt-auto md:flex md:flex-col md:gap-1', className]}
>
  {@render children?.()}
</div>
