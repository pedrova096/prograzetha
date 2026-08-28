<script lang="ts">
  import type { LabelProps } from './Dropdown.types';

  let { children, class: className, ...rest }: LabelProps = $props();
</script>

<span
  class={['px-3 py-1.5 text-xs font-medium text-zinc-400', className]}
  {...rest}
>
  {@render children()}
</span>
