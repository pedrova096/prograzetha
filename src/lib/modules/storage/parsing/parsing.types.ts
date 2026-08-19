import type { NodeState, NodeTypes } from '../../nodes';

export enum SerializedEdgeKind {
  Edge = 'edge',
  Branch = 'branch',
  Loop = 'loop',
}

export type SerializedNode = {
  id: string;
  type: NodeTypes;
  data: unknown;
  state: NodeState;
};

export type SerializedEdge = {
  kind: SerializedEdgeKind;
  source: string;
  target: string;
  previous: string;
  left?: string;
  right?: string;
  body?: string;
};

export type SerializedGraph = {
  start: string;
  nodes: SerializedNode[];
  edges: SerializedEdge[];
};

export type ProgramDocumentSchema = string;
export type ProgramDocumentVersion = 1;

export type ProgramDocument = {
  schema: ProgramDocumentSchema;
  version: ProgramDocumentVersion;
  graph: SerializedGraph;
};
