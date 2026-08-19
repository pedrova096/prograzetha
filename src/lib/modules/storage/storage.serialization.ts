import { BranchEdge, Edge, LoopEdge } from '../edge';
import { createNode } from '../nodes';
import {
  parseDocument,
  CURRENT_PROGRAM_VERSION,
  PROGRAM_DOCUMENT_SCHEMA,
} from './parsing';
import { SerializedEdgeKind } from './parsing';
import type { GraphState } from '../graph';
import type { ProgramDocument, SerializedEdge } from './parsing';

const serializeEdge = (edge: Edge): SerializedEdge => {
  if (edge instanceof BranchEdge) {
    return {
      kind: SerializedEdgeKind.Branch,
      source: edge.source,
      target: edge.target,
      previous: edge.previous,
      left: edge.left,
      right: edge.right,
    };
  }

  if (edge instanceof LoopEdge) {
    return {
      kind: SerializedEdgeKind.Loop,
      source: edge.source,
      target: edge.target,
      previous: edge.previous,
      body: edge.body,
    };
  }

  return {
    kind: SerializedEdgeKind.Edge,
    source: edge.source,
    target: edge.target,
    previous: edge.previous,
  };
};

const deserializeEdge = (edge: SerializedEdge): Edge => {
  if (edge.kind === SerializedEdgeKind.Branch) {
    return new BranchEdge(
      edge.source,
      edge.target,
      edge.previous,
      edge.left!,
      edge.right!,
    );
  }

  if (edge.kind === SerializedEdgeKind.Loop) {
    return new LoopEdge(edge.source, edge.target, edge.previous, edge.body!);
  }

  return new Edge(edge.source, edge.target, edge.previous);
};

export const serializeProgram = (graph: GraphState): ProgramDocument => ({
  schema: PROGRAM_DOCUMENT_SCHEMA,
  version: CURRENT_PROGRAM_VERSION,
  graph: {
    start: graph.start,
    nodes: [...graph.nodes.values()].map((node) => ({
      id: node.id,
      type: node.type,
      data: node.data,
      state: node.state,
    })),
    edges: [...graph.edges.values()].map(serializeEdge),
  },
});

export const stringifyProgram = (graph: GraphState): string =>
  JSON.stringify(serializeProgram(graph), null, 2);

export const deserializeProgram = (source: string | unknown): GraphState => {
  const rawDocument = typeof source === 'string' ? JSON.parse(source) : source;
  const document = parseDocument(rawDocument);

  return {
    start: document.graph.start,
    nodes: new Map(
      document.graph.nodes.map((node) => [node.id, createNode(node)]),
    ),
    edges: new Map(
      document.graph.edges.map((edge) => [edge.source, deserializeEdge(edge)]),
    ),
  };
};
