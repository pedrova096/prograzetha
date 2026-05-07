<script lang="ts">
  import { Plus } from 'lucide-svelte';
  import { Dropdown } from '~/lib/components/Dropdown';
  import { NodeTypes } from '~/lib/modules/nodes';

  import { TITLE_BY_TYPE } from '../Node';
  import type { AddButtonProps } from './AddButton.types';

  let {
    onSelect,
    open = $bindable(false),
    triggerLabel = 'Add node',
    class: className,
    ...props
  }: AddButtonProps = $props();

  const options = [
    NodeTypes.Input,
    NodeTypes.Output,
    NodeTypes.Condition,
    NodeTypes.Operation,
  ].map((type) => ({
    label: TITLE_BY_TYPE[type],
    value: type,
  }));
</script>

<div {...props} class={className}>
  <Dropdown.Root {onSelect} bind:open>
    <Dropdown.Trigger
      class={[
        'flex size-5 items-center justify-center rounded-full border border-blue-400 bg-blue-500 text-white shadow-md transition-transform hover:scale-105',
        open && 'scale-105',
      ]}
      aria-label={triggerLabel}
    >
      <Plus class="size-3.5" />
    </Dropdown.Trigger>
    <Dropdown.Content {options} searchable clearable />
  </Dropdown.Root>
</div>
