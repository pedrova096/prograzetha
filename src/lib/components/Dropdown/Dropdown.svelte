<script lang="ts">
  import tippy, { type Instance } from 'tippy.js';
  import type { RootProps } from './Dropdown.types';
  import { setDropdownContext } from './Dropdown.context';

  let {
    children,
    onSelect,
    offset,
    open = $bindable(false),
  }: RootProps = $props();

  let triggerEl = $state<HTMLElement | null>(null);
  let contentEl = $state<HTMLElement | null>(null);
  let instance: Instance | null = null;

  $effect(() => {
    if (!triggerEl || !contentEl) return;

    instance = tippy(triggerEl, {
      content: contentEl,
      interactive: true,
      inertia: true,
      allowHTML: true,
      trigger: 'click',
      arrow: false,
      theme: 'dropdown',
      onShow: () => {
        open = true;
      },
      onHide: () => {
        open = false;
      },
      offset: offset ?? [0, -5],
    });

    return () => {
      instance?.destroy();
      instance = null;
    };
  });

  setDropdownContext({
    close: () => instance?.hide(),
    toggle: () => (open ? instance?.hide() : instance?.show()),
    onSelect: (event, option) => {
      option.onclick?.(event, option);
      onSelect?.(event, option);
      instance?.hide();
    },
    setTriggerRef: (element) => (triggerEl = element),
    setContentRef: (element) => (contentEl = element),
  });
</script>

{@render children()}

<style>
  :global(.tippy-box[data-theme='dropdown']) {
    background-color: unset;
  }
  :global(.tippy-content[data-theme='dropdown']) {
    padding: 0;
  }
  :global(.tippy-box[data-inertia][data-state='visible']) {
    transition-timing-function: ease-in-out;
  }
</style>
