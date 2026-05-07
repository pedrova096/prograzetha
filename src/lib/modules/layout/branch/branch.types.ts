import type { LayoutBlock } from '../layout.types';

export type BranchLayoutOptions = {
  id: string;
  condition: LayoutBlock;
  then: LayoutBlock;
  else: LayoutBlock;
  gapX?: number;
  gapY?: number;
  joinGapY?: number;
};
