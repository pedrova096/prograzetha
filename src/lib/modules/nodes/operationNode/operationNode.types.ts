import type { LiteralVariants } from '~/lib/constants';
import type { Expression } from '~/lib/modules/expression';

export type OperationNodeData = {
  leftSide: string;
  rightSide: string;
  tree: null | Expression;
  leftMeta: { isDeclaration: boolean; type: `${LiteralVariants}` };
};
