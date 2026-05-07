import type { LayoutBlock } from '../layout.types';

export type VStackLayoutOptions = {
  id: string;
  children: LayoutBlock[];
  gap?: number;
};
