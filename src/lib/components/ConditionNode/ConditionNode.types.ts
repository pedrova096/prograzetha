import type { Node } from '~/App.mock';

export type ConditionNodeProps = {
  node: Node;
};

export type ConditionEdge = {
  from: string;
  to: string;
  left: string;
  right: string;
};
