<script lang="ts">
  import { Plus } from 'lucide-svelte';
  import type { AddButtonProps } from './AddButton.types';
  import { Dropdown } from '~/lib/components/Dropdown';
  import { NodeTypes } from '~/lib/modules/nodes';

  let { onSelect, circle = true }: AddButtonProps = $props();

  let open = $state(false);

  const options = [
    { label: 'Input', value: NodeTypes.Input },
    { label: 'Output', value: NodeTypes.Output },
    { label: 'Condition', value: NodeTypes.Condition },
    { label: 'Operation', value: NodeTypes.Operation },
  ];
</script>

<div class="relative group mx-auto -mt-2 -mb-1" role="img" aria-label="Add">
  <svg
    class="w-[10px] h-[40px] text-blue-500"
    fill="currentColor"
    stroke="currentColor"
  >
    {#if circle}
      <circle
        id="outline-half-circle"
        class="fill-transparent stroke-2 stroke-current"
        cx="5"
        cy="5"
        r="4"
      />
    {/if}
    <path
      id="outline-line"
      class="fill-transparent stroke-2 stroke-current"
      d={circle ? 'm5 10 l0 30' : 'm5 0 l0 40'}
    />
    <path
      id="chevron-down"
      class="fill-transparent stroke-2 stroke-current"
      d="m1 35 4 4 4-4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <Dropdown.Root {onSelect} bind:open>
    <Dropdown.Trigger
      class={[
        'opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white size-4 flex items-center justify-center rounded-full mx-auto cursor-pointer',
        open ? 'opacity-100' : 'group-hover:opacity-100',
      ]}
    >
      <Plus class="size-4" />
    </Dropdown.Trigger>
    <Dropdown.Content {options} searchable clearable />
  </Dropdown.Root>
</div>
