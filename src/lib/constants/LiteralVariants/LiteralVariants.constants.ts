import { CircleSlash, Hash, Quote, CircleCheck } from 'lucide-svelte';
import type { LucideIconProps } from '~/lib/types';

import { LiteralVariants } from './LiteralVariants.types';

import CircleCheckSVG from './svg/circle-check.svg?raw';
import HashSVG from './svg/hash.svg?raw';
import QuoteSVG from './svg/quote.svg?raw';
import CircleSlashSVG from './svg/circle-slash.svg?raw';

export const VARIANTS_SVG: Record<LiteralVariants, string> = {
  [LiteralVariants.Boolean]: CircleCheckSVG,
  [LiteralVariants.Number]: HashSVG,
  [LiteralVariants.String]: QuoteSVG,
  [LiteralVariants.Null]: CircleSlashSVG,
};

export const VARIANTS_ICONS: Record<LiteralVariants, LucideIconProps> = {
  [LiteralVariants.Boolean]: CircleCheck,
  [LiteralVariants.Number]: Hash,
  [LiteralVariants.String]: Quote,
  [LiteralVariants.Null]: CircleSlash,
};

export const VARIANTS_CLASS: Record<LiteralVariants, string> = {
  [LiteralVariants.Boolean]:
    'text-emerald-700 bg-emerald-50 border-emerald-200',
  [LiteralVariants.Number]: 'text-violet-700 bg-violet-50 border-violet-200',
  [LiteralVariants.String]: 'text-amber-700 bg-amber-50 border-amber-200',
  [LiteralVariants.Null]: 'text-zinc-600 bg-zinc-50 border-zinc-200',
};

export const VARIANTS_LABEL: Record<LiteralVariants, string> = {
  [LiteralVariants.String]: 'Texto',
  [LiteralVariants.Number]: 'Número',
  [LiteralVariants.Boolean]: 'Booleano',
  [LiteralVariants.Null]: 'Nulo',
};

export const LITERAL_VARIANT_MAP = {
  [LiteralVariants.String]: {
    svg: VARIANTS_SVG[LiteralVariants.String],
    icon: VARIANTS_ICONS[LiteralVariants.String],
    class: VARIANTS_CLASS[LiteralVariants.String],
    label: VARIANTS_LABEL[LiteralVariants.String],
  },
  [LiteralVariants.Number]: {
    svg: VARIANTS_SVG[LiteralVariants.Number],
    icon: VARIANTS_ICONS[LiteralVariants.Number],
    class: VARIANTS_CLASS[LiteralVariants.Number],
    label: VARIANTS_LABEL[LiteralVariants.Number],
  },
  [LiteralVariants.Boolean]: {
    svg: VARIANTS_SVG[LiteralVariants.Boolean],
    icon: VARIANTS_ICONS[LiteralVariants.Boolean],
    class: VARIANTS_CLASS[LiteralVariants.Boolean],
    label: VARIANTS_LABEL[LiteralVariants.Boolean],
  },
  [LiteralVariants.Null]: {
    svg: VARIANTS_SVG[LiteralVariants.Null],
    icon: VARIANTS_ICONS[LiteralVariants.Null],
    class: VARIANTS_CLASS[LiteralVariants.Null],
    label: VARIANTS_LABEL[LiteralVariants.Null],
  },
};
