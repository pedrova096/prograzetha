<script lang="ts">
  import { setSortableContext } from './Sortable.context';
  import type { SortableProps } from './Sortable.types';

  import { DEFAULT_CLASSNAMES } from './Sortable.constants';
  import { getSortable } from './Sortable.utils';

  let {
    children,
    options = {},
    group,
    class: className,
    onSort,
    onEnd,
    onStart,
    onAdd,
    onChange,
    onRemove,
    classNames: classNamesProp,
    ...rest
  }: SortableProps = $props();

  let classNames = { ...DEFAULT_CLASSNAMES, ...classNamesProp };
  let sortable = getSortable({
    ...options,
    classNames,
    onAdd,
    onChange,
    onEnd,
    onRemove,
    onSort,
    onStart,
  });

  setSortableContext({ classNames });
</script>

<ul {@attach sortable} class={['sort-list', className]} {...rest}>
  {#if children}
    {@render children()}
  {/if}
</ul>

<style lang="postcss">
  @reference "../../../app.css";

  .sort-list {
    @apply m-0 list-none;
  }

  :global(.sort-ghost) {
    @apply opacity-50;
  }

  :global(.sort-chosen) {
    @apply opacity-75;
  }

  :global(.sort-drag) {
    @apply opacity-100;
  }
</style>
