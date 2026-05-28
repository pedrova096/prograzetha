<script lang="ts">
  import { getSortableContext } from '../Sortable.context';
  import type { SortHandleProps } from './SortHandle.types';

  let { children, class: className, ...rest }: SortHandleProps = $props();

  const {
    classNames: { handle: handleClass },
  } = getSortableContext();
</script>

<button
  type="button"
  class={[handleClass, 'sort-handle-button', className]}
  {...rest}
>
  {@render children()}
</button>

<style lang="postcss">
  @reference "../../../app.css";

  .sort-handle-button {
    @apply cursor-grab touch-none p-1 active:cursor-grabbing;
  }
</style>
