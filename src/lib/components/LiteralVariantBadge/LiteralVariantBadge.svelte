<script lang="ts">
  import { LITERAL_VARIANT_MAP } from '~/lib/constants';
  import type { LiteralVariantBadgeProps } from './LiteralVariantBadge.types';

  let { value, class: className, ...rest }: LiteralVariantBadgeProps = $props();

  const variant = $derived(LITERAL_VARIANT_MAP[value]);
  const Icon = $derived(variant.icon);
</script>

<span
  class={[
    'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[0.65rem] font-medium self-start',
    variant.class,
    className,
  ]}
  {...rest}
>
  <Icon class="size-3" />
  {variant.label}
</span>
