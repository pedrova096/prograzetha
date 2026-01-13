export type Node = {
  id: string;
  type: string;
  x: number;
  y: number;
};

export type Edge = {
  from: string;
  to: string;
};

export type DiagramProps = {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
  from: string;
};
