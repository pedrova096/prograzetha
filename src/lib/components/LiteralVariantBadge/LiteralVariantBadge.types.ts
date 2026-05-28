import type { HTMLAttributes } from 'svelte/elements';
import type { LiteralVariants } from '~/lib/constants';

export type LiteralVariantBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  value: `${LiteralVariants}`;
};
