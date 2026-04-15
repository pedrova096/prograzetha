import { setContext, getContext } from 'svelte';
import { Edge, EDGES, Node, NODES, NodeTypes, START_NODE } from './App.mock';
import type { DiagramContext } from './App.types';

const DIAGRAM_KEY = Symbol('DIAGRAM');

let diagram = $state<DiagramContext>({
  nodes: NODES,
  edges: EDGES,
  start: START_NODE.id,
});

export const addNode = (from: string) => {
  const sourceEdge = diagram.edges.get(from)!;

  const node = Node.create(NodeTypes.Input);
  const newNodes = new Map(diagram.nodes).set(node.id, node);
  const newEdges = new Map(diagram.edges).set(from, Edge.create(from, node.id));

  if (sourceEdge?.to) {
    newEdges.set(node.id, Edge.create(node.id, sourceEdge.to));
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
