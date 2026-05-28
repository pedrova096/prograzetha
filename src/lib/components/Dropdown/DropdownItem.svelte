<script lang="ts" generics="T = string">
  import type { MouseEventHandler } from 'svelte/elements';
  import { getDropdownContext } from './Dropdown.context';
  import type { ItemProps } from './Dropdown.types';

  let {
    value,
    label,
    icon: Icon,
    onclick,
    disabled = false,
    children,
  }: ItemProps<T> = $props();

  const { onSelect } = getDropdownContext<T>();

  const onClickHandler: MouseEventHandler<HTMLButtonElement> = (event) => {
    onSelect(event, { value, label, icon: Icon, onclick, disabled });
  };
</script>

<li>
  <button
    type="button"
    onclick={onClickHandler}
    {disabled}
    class={[
      'w-full px-3 py-2 text-left text-sm rounded-lg transition-all duration-100',
      'flex items-center gap-2',
      disabled
        ? 'text-slate-300 cursor-not-allowed'
        : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer',
    ]}
  >
    {#if Icon}
      <Icon class="size-4 mb-0.5" />
    {/if}

    {#if children}
      {@render children()}
    {:else}
      <span class="flex-1">{label}</span>
    {/if}
  </button>
</li>
