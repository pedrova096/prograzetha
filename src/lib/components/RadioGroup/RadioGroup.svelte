<script lang="ts">
  import type { RadioGroupProps } from './RadioGroup.types';

  let {
    ref = $bindable(null), // TODO: use it
    value = $bindable(''),
    class: className,
    classNames,
    label: inputLabel,
    helper: helperProps,
    helperHint,
    id,
    error,
    options = [],
    optionRender,
    optionLabel = 'label',
    optionValue = 'value',
    name,
    variant = 'outline',
    size = 'md',
    ...restProps
  }: RadioGroupProps = $props();

  const groupName = $derived(name ?? id);

  const helper = $derived(
    Array.isArray(helperProps) ? helperProps.join(', ') : helperProps,
  );
</script>

<div class={['flex w-full flex-col gap-1.5', className, classNames?.container]}>
  {#if inputLabel}
    <span
      id={`${groupName}-label`}
      class={['block text-sm font-medium text-zinc-700', classNames?.label]}
    >
      {inputLabel}
    </span>
  {/if}
  <div
    class={[
      'inline-flex w-fit items-center gap-1 rounded-lg bg-zinc-100 p-1',
      classNames?.radioContainer,
    ]}
    role="radiogroup"
    aria-labelledby={inputLabel ? `${groupName}-label` : undefined}
  >
    {#each options as option, index}
      {@const optionId = `${groupName}-${index}`}
      {@const optionValueResolved = option[optionValue]}
      {@const selected = value === optionValueResolved}

      <label class={['relative', classNames?.radioWrapper]} for={optionId}>
        <input
          type="radio"
          id={optionId}
          {name}
          class={['peer sr-only', classNames?.radio]}
          bind:group={value}
          value={optionValueResolved}
          {...restProps}
        />
        <span
          class={[
            'toggle-group-item inline-flex items-center justify-center rounded-md font-medium transition-all',
            'cursor-pointer select-none',
            'focus-within:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
            error
              ? 'peer-focus-visible:ring-red-500'
              : 'peer-focus-visible:ring-zinc-400',
            classNames?.radioLabel,
          ]}
          data-variant={variant}
          data-size={size}
          data-selected={selected}
        >
          {#if optionRender}
            {@render optionRender(option, selected)}
          {:else}
            {option[optionLabel]}
          {/if}
        </span>
      </label>
    {/each}
  </div>

  {@render helperHint?.()}
  {#if helper}
    <p class={['text-muted-foreground text-sm', error && 'text-red-500']}>
      {helper}
    </p>
  {/if}
</div>

<style lang="postcss">
  @reference "../../app.css";

  .toggle-group-item {
    &[data-variant='default'] {
      @apply text-zinc-600 hover:bg-white/60 hover:text-zinc-950;
      &[data-selected='true'] {
        @apply bg-white text-zinc-950 shadow-sm;
      }
    }

    &[data-variant='outline'] {
      @apply border border-transparent text-zinc-600 hover:bg-white/60 hover:text-zinc-950;
      &[data-selected='true'] {
        @apply border-zinc-200 bg-white text-zinc-950 shadow-sm;
      }
    }

    &[data-variant='secondary'] {
      @apply text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950;
      &[data-selected='true'] {
        @apply bg-zinc-900 text-white shadow-sm hover:bg-zinc-900;
      }
    }

    &[data-size='sm'] {
      @apply h-7 px-2.5 text-xs;
    }
    &[data-size='md'] {
      @apply h-8 px-3 text-sm;
    }
    &[data-size='lg'] {
      @apply h-10 px-4 text-base;
    }
  }
</style>
