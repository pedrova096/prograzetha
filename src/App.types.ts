import type { Node, Edge } from './App.mock';

export type DiagramContext = {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
  start: string;
};
