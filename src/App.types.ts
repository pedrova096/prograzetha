import type { Edge } from './lib/modules/edge';
import type { Node } from './lib/modules/nodes';
import type { RuntimePlayer } from './lib/modules/runtime';

export type DiagramContext = {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
  start: string;
};

export type RuntimeContext = {
  runtime: RuntimePlayer;
};
