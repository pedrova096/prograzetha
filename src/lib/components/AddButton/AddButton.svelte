<script lang="ts">
  import { Plus } from '@lucide/svelte';
  import { Dropdown, type DropdownEntry } from '~/lib/components/Dropdown';
  import { NodeTypes } from '~/lib/modules/nodes';

  import { ICON_BY_TYPE, TITLE_BY_TYPE } from '../Diagram/Node';
  import type { AddButtonProps } from './AddButton.types';

  let {
    icon: Icon = Plus,
    onSelected,
    open = $bindable(false),
    triggerLabel = 'Add node',
    class: className,
    ...props
  }: AddButtonProps = $props();

  const createOption = (type: NodeTypes) => ({
    label: TITLE_BY_TYPE[type],
    value: type,
    icon: ICON_BY_TYPE[type],
  });

  const options: DropdownEntry<NodeTypes>[] = [
    createOption(NodeTypes.Input),
    createOption(NodeTypes.Output),
    createOption(NodeTypes.Condition),
    createOption(NodeTypes.Operation),
    {
      type: 'group',
      label: 'Ciclos',
      options: [
        createOption(NodeTypes.ForLoop),
        createOption(NodeTypes.WhileLoop),
      ],
    },
  ];
</script>

<div {...props} class={className}>
  <Dropdown.Root {onSelected} bind:open>
    <Dropdown.Trigger
      class={[
        'flex size-5 items-center justify-center rounded-full border border-blue-400 bg-blue-500 text-white shadow-md transition-transform hover:scale-105',
        open && 'scale-105',
      ]}
      aria-label={triggerLabel}
    >
      <Icon class="size-3.5" />
    </Dropdown.Trigger>
    <Dropdown.Content {options} searchable clearable />
  </Dropdown.Root>
</div>
