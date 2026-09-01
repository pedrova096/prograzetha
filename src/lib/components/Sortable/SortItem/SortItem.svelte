<script lang="ts">
  import { getSortableContext } from '../Sortable.context';
  import type { SortItemProps } from './SortItem.types';

  let {
    children,
    ref = $bindable(),
    class: className,
    ...rest
  }: SortItemProps = $props();

  const {
    classNames: { item: itemClass },
  } = getSortableContext();
</script>

<li bind:this={ref} class={[itemClass, 'sort-item', className]} {...rest}>
  {@render children()}
</li>

<style lang="postcss">
  @reference "../../../../app.css";

  .sort-item {
    @apply list-none;
  }
</style>
