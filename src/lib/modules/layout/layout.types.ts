import type { Node } from '~/lib/modules/nodes';
import type { Edge, EdgeInsertionTarget } from '~/lib/modules/edge';

export type Size = {
  width: number;
  height: number;
};

export type Point = {
  x: number;
  y: number;
};

export type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type RenderNode = {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type RenderEdge = {
  id: string;
  source: string;
  points: Point[];
  insertTarget?: EdgeInsertionTarget;
  isJoin?: boolean;
};

export type Anchors = {
  input: Point;
  output: Point;
};

export type LayoutResult = {
  box: Box;
  nodes: RenderNode[];
  edges: RenderEdge[];
  anchors: Anchors;
  outputSource: string;
};

export interface LayoutBlock {
  measure(): Size;
  layout(origin: Point): LayoutResult;
}

export type GetLayoutOptions = {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
};
