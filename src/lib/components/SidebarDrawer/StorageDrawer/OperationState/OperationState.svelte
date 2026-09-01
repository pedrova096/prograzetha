<script lang="ts">
  import { CircleAlert, CircleCheck } from '@lucide/svelte';

  import {
    OperationKind,
    type OperationStateProps,
  } from './OperationState.types';

  let { kind, message }: OperationStateProps = $props();

  const isError = $derived(kind === OperationKind.Error);
</script>

<div
  class={[
    'flex items-start gap-2 rounded-lg border p-3 text-sm',
    isError
      ? 'border-red-200 bg-red-50 text-red-800'
      : 'border-emerald-200 bg-emerald-50 text-emerald-800',
  ]}
  role={isError ? 'alert' : 'status'}
  aria-live="polite"
>
  {#if isError}
    <CircleAlert class="mt-0.5 size-4 shrink-0" />
  {:else}
    <CircleCheck class="mt-0.5 size-4 shrink-0" />
  {/if}
  <span class="break-words">{message}</span>
</div>
