<script lang="ts">
  import type { GroupProps } from './Dropdown.types';

  let { children, class: className, ...rest }: GroupProps = $props();
</script>

<div
  class={['space-y-0.5', className]}
  role="group"
  {...rest}
>
  {@render children()}
</div>
