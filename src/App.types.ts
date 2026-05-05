import type { Edge } from './lib/modules/edge';
import type { Node } from './lib/modules/nodes';

export type DiagramContext = {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
  start: string;
};
