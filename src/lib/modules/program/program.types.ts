import type { Node } from '~/lib/modules/nodes';
import type { Edge } from '~/lib/modules/edge';

export type GetASTOptions = {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
};
