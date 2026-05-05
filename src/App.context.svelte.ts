import { setContext, getContext } from 'svelte';
import { EDGES, NODES, START_NODE } from './App.mock';
import type { DiagramContext } from './App.types';
import { Edge } from './lib/modules/edge';
import { InputNode } from './lib/modules/nodes';

const DIAGRAM_KEY = Symbol('DIAGRAM');

let diagram = $state<DiagramContext>({
  nodes: NODES,
  edges: EDGES,
  start: START_NODE.id,
});

export const addNode = (from: string) => {
  const sourceEdge = diagram.edges.get(from)!;

  const node = InputNode.create();
  const newNodes = new Map(diagram.nodes).set(node.id, node);
  const newEdges = new Map(diagram.edges).set(from, Edge.create(from, node.id));

  if (sourceEdge?.target) {
    newEdges.set(node.id, Edge.create(node.id, sourceEdge.target));
  }

  diagram.nodes = newNodes;
  diagram.edges = newEdges;
};

export const setDiagramContext = () => {
  return setContext(DIAGRAM_KEY, { diagram });
};

export const getDiagramContext = () => {
  return getContext<ReturnType<typeof setDiagramContext>>(DIAGRAM_KEY);
};
