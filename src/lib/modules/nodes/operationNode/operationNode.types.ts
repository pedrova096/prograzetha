import type jsep from 'jsep';

export type OperationNodeData = {
  leftSide: string;
  rightSide: string;
  tree: null | jsep.Expression;
  isNewVariable: boolean;
};

export type OperationNodeOptions = {
  variables: string[];
};
