import type jsep from 'jsep';
import type { LiteralVariants } from '~/lib/constants';

export type OperationNodeData = {
  leftSide: string;
  rightSide: string;
  tree: null | jsep.Expression;
  leftMeta: { isDeclaration: boolean; type: `${LiteralVariants}` };
};
