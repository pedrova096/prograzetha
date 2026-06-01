<script lang="ts">
  import { EllipsisVertical, GripVertical, Trash2 } from 'lucide-svelte';

  import { SortHandle } from '~/lib/components/Sortable';

  import { CONDITION_OPERATOR_OPTIONS } from './ConditionNode.constants';
  import { FormFields, type ConditionNodeProps } from './ConditionNode.types';
  import { LiteralVariantBadge } from '~/lib/components/LiteralVariantBadge';
  import { Dropdown } from '~/lib/components/Dropdown';
  import CodeEditor from '~/lib/components/CodeEditor/CodeEditor.svelte';
  import { classifyInput, isLiteralKind } from './ConditionNode.utils';

  let { name, value, classNames, onchange, onremove }: ConditionNodeProps =
    $props();

  const names = $derived({
    leftSide: `${name}.${FormFields.LeftSide}`,
    operator: `${name}.${FormFields.Operator}`,
    rightSide: `${name}.${FormFields.RightSide}`,
  });

  const onChangeHandler = (field: FormFields) => (fieldValue: string) => {
    const nextValue = { ...value!, [field]: fieldValue };
    onchange?.(
      new CustomEvent('change', {
        detail: { value: nextValue, name },
      }),
    );
  };

  const [leftInputKind, rightInputKind] = $derived([
    classifyInput(value?.[FormFields.LeftSide]),
    classifyInput(value?.[FormFields.RightSide]),
  ]);
</script>

<div
  class="grid grid-cols-[auto_minmax(0,1fr)_5.5rem_minmax(0,1fr)_auto] gap-2 rounded-md border border-zinc-200 bg-white px-2 py-1.5 shadow-sm min-w-sm max-w-md"
>
  <SortHandle class="text-zinc-400 hover:text-zinc-700">
    <GripVertical class="size-4" />
  </SortHandle>

  <CodeEditor
    aria-label="Lado izquierdo"
    class={['input-field', classNames?.inputField]}
    language="javascript"
    name={names.leftSide}
    id={FormFields.LeftSide}
    bind:value={
      () => value?.[FormFields.LeftSide] || '',
      onChangeHandler(FormFields.LeftSide)
    }
  >
    {#snippet helperHint()}
      {#if isLiteralKind(leftInputKind)}
        <LiteralVariantBadge value={leftInputKind.variant} />
      {/if}
    {/snippet}
  </CodeEditor>

  <div class="mt-2">
    <select
      aria-label="Operador"
      class={[
        'h-8 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 text-sm text-zinc-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20',
        classNames?.selectField,
      ]}
      name={names.operator}
      bind:value={
        () => value?.[FormFields.Operator] || '',
        onChangeHandler(FormFields.Operator)
      }
      id={FormFields.Operator}
    >
      {#each CONDITION_OPERATOR_OPTIONS as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>

  <CodeEditor
    aria-label="Lado derecho"
    class={['input-field', classNames?.inputField]}
    id={FormFields.RightSide}
    language="javascript"
    name={names.rightSide}
    bind:value={
      () => value?.[FormFields.RightSide] || '',
      onChangeHandler(FormFields.RightSide)
    }
  >
    {#snippet helperHint()}
      {#if isLiteralKind(rightInputKind)}
        <LiteralVariantBadge value={rightInputKind.variant} />
      {/if}
    {/snippet}
  </CodeEditor>

  <Dropdown.Root>
    <Dropdown.Trigger
      class="mt-2 inline-flex size-8 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
      aria-label="Abrir acciones de condicion"
    >
      <EllipsisVertical class="size-4" />
    </Dropdown.Trigger>
    <Dropdown.Content
      options={[
        {
          label: 'Eliminar',
          value: 'delete',
          icon: Trash2,
          onclick: onremove,
        },
      ]}
    />
  </Dropdown.Root>
</div>

<style lang="postcss">
  @reference "../../../../../../app.css";

  .input-field {
    @apply min-w-0 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm text-zinc-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20;
  }
</style>
