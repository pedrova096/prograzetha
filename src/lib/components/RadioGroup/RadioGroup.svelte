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
    class={['inline-flex', classNames?.radioContainer]}
    role="group"
    aria-labelledby={inputLabel ? `${groupName}-label` : undefined}
  >
    {#each options as option, index}
      <div class={['relative', classNames?.radioWrapper]}>
        {#if optionRender}
          {@render optionRender(option)}
        {:else}
          {@const [isFirst, isLast] = [
            index === 0,
            index === options.length - 1,
          ]}
          <input
            type="radio"
            id={`${groupName}-${index}`}
            {name}
            class="sr-only"
            bind:group={value}
            value={option[optionValue]}
            {...restProps}
          />
          <label
            class={[
              'button-group-item inline-flex items-center justify-center font-medium transition-all cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 disabled:opacity-50',
              {
                'rounded-l-md': isFirst,
                'rounded-r-md': isLast,
                'focus-within:ring-red-500': error,
                'focus-within:ring-teal-500': !error,
              },
              classNames?.radioLabel,
            ]}
            data-variant={variant}
            data-size={size}
            data-selected={value === option[optionValue]}
            for={`${groupName}-${index}`}
          >
            {option[optionLabel]}
          </label>
        {/if}
      </div>
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

  .button-group-item {
    &[data-variant='default'] {
      @apply border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50;
      &[data-selected='true'] {
        @apply border-teal-600 bg-teal-600 text-white hover:bg-teal-700;
      }
    }

    &[data-variant='outline'] {
      @apply border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50;
      &[data-selected='true'] {
        @apply border-teal-500 bg-teal-50 text-teal-700 hover:bg-teal-100;
      }
    }

    &[data-variant='secondary'] {
      @apply border border-zinc-200 bg-zinc-100 text-zinc-900 hover:bg-zinc-200;
      &[data-selected='true'] {
        @apply border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800;
      }
    }

    &[data-size='sm'] {
      @apply px-3 py-1.5 text-xs;
    }
    &[data-size='md'] {
      @apply px-4 py-2 text-sm;
    }
    &[data-size='lg'] {
      @apply px-6 py-3 text-base;
    }
  }
</style>
