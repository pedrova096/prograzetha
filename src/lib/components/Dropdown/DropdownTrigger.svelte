<script lang="ts">
  import { getDropdownContext } from './Dropdown.context';
  import type { TriggerProps } from './Dropdown.types';

  let { children, class: className, ...rest }: TriggerProps = $props();

  const { setTriggerRef } = getDropdownContext();
</script>

<button
  bind:this={() => {}, setTriggerRef}
  type="button"
  class={className}
  {...rest}
>
  {@render children?.()}
</button>
