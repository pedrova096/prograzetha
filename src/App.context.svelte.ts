import { setContext, getContext } from 'svelte';
import { EDGES, NODES, START_NODE } from './App.mock';
import type { DiagramContext } from './App.types';
import { Edge } from './lib/modules/edge';
import { Node, NodeTypes, createNode } from './lib/modules/nodes';

const DIAGRAM_KEY = Symbol('DIAGRAM');

let diagram = $state<DiagramContext>({
  nodes: NODES,
  edges: EDGES,
  start: START_NODE.id,
});

export const setDiagramContext = () => {
  return setContext(DIAGRAM_KEY, { diagram });
};

export const getDiagramContext = () => {
  return getContext<ReturnType<typeof setDiagramContext>>(DIAGRAM_KEY);
};

export const updateNode = (node: Node) => {
  diagram.nodes = new Map(diagram.nodes).set(node.id, node);
};

export const attachNewNode = (sourceNode: Node, newNodeType: NodeTypes) => {
  const newNode = createNode({ type: newNodeType });

  const prevSourceEdge = diagram.edges.get(sourceNode.id)!;

  const newNodes = new Map(diagram.nodes).set(newNode.id, newNode);
  const newEdges = new Map(diagram.edges).set(
    sourceNode.id,
    Edge.create(sourceNode.id, newNode.id, prevSourceEdge.previous),
  );

  if (prevSourceEdge?.target) {
    newEdges.set(
      newNode.id,
      Edge.create(newNode.id, prevSourceEdge.target, sourceNode.id),
    );
  }

  diagram.nodes = newNodes;
  diagram.edges = newEdges;

  return newNode;
};
