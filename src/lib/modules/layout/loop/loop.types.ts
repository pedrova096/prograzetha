import type { LayoutBlock } from '../layout.types';

export type LoopLayoutOptions = {
  id: string;
  condition: LayoutBlock;
  body: LayoutBlock;
  gapY?: number;
  exitGapY?: number;
  backGapX?: number;
};
