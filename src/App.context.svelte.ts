import { setContext, getContext } from 'svelte';
import type { DiagramContext, RuntimeContext } from './App.types';
import { BranchEdge, Edge, EdgeInsertionTargetType } from './lib/modules/edge';
import type { EdgeInsertionTarget } from './lib/modules/edge';
import { getRuntimeProgram, RuntimePlayer } from './lib/modules/runtime';
import {
  EndNode,
  Node,
  NodeTypes,
  StartNode,
  createNode,
} from './lib/modules/nodes';

const DIAGRAM_KEY = Symbol('DIAGRAM');
const RUNTIME_KEY = Symbol('RUNTIME');

const createContext = (): DiagramContext => {
  const startNode = StartNode.create();
  const endNode = EndNode.create();

  const nodes = new Map<string, Node>([
    [startNode.id, startNode],
    [endNode.id, endNode],
  ]);

  const edges = new Map<string, Edge>([
    [startNode.id, Edge.create(startNode.id, endNode.id)],
  ]);

  return {
    nodes,
    edges,
    start: startNode.id,
  };
};

let diagram = $state<DiagramContext>(createContext());

const createRuntime = () => {
  return new RuntimePlayer({
    program: getRuntimeProgram(
      { nodes: diagram.nodes, edges: diagram.edges },
      diagram.start,
    ),
    services: {
      alert: async () => {},
      input: async (prompt) => globalThis.prompt?.(prompt) ?? '',
    },
  });
};

let runtimeContext = $state<RuntimeContext>({
  runtime: createRuntime(),
});

export const setDiagramContext = () => {
  return setContext(DIAGRAM_KEY, { diagram });
};

export const setRuntimeContext = () => {
  $effect(() => {
    runtimeContext.runtime = createRuntime();
  });

  return setContext(RUNTIME_KEY, runtimeContext);
};

export const getDiagramContext = () => {
  return getContext<ReturnType<typeof setDiagramContext>>(DIAGRAM_KEY);
};

export const getRuntimeContext = () => {
  return getContext<ReturnType<typeof setRuntimeContext>>(RUNTIME_KEY);
};

export const updateNode = (node: Node) => {
  diagram.nodes = new Map(diagram.nodes).set(node.id, node);
};

const getNewEdge = (newNode: Node, target: string, previous: string) => {
  const baseEdge = Edge.create(newNode.id, target, previous);

  if (newNode.type === NodeTypes.Condition) {
    return BranchEdge.fromEdge(baseEdge);
  }

  return baseEdge;
};

const attachBranchNewNode = (
  target: Extract<
    EdgeInsertionTarget,
    { type: EdgeInsertionTargetType.Branch }
  >,
  currentEdge: BranchEdge,
  newNode: Node,
) => {
  const branchTarget = currentEdge[target.side];

  const newNodes = new Map(diagram.nodes).set(newNode.id, newNode);
  const newEdges = new Map(diagram.edges)
    .set(target.source, currentEdge.withBranchSide(target.side, newNode.id))
    .set(newNode.id, getNewEdge(newNode, branchTarget, currentEdge.source));

  if (branchTarget) {
    newEdges.set(
      branchTarget,
      diagram.edges.get(branchTarget)!.withPrevious(newNode.id),
    );
  }

  diagram.nodes = newNodes;
  diagram.edges = newEdges;

  return newNode;
};

export const attachNewNode = (
  target: EdgeInsertionTarget,
  newNodeType: NodeTypes,
) => {
  const currentEdge = diagram.edges.get(target.source);

  if (!currentEdge) {
    console.error('Invalid edge insertion target', target);
    return null;
  }

  const newNode = createNode({ type: newNodeType });

  if (target.type === EdgeInsertionTargetType.Branch) {
    if (!(currentEdge instanceof BranchEdge)) {
      console.error('Invalid branch insertion target', target);
      return null;
    }

    return attachBranchNewNode(target, currentEdge, newNode);
  }

  const newNodes = new Map(diagram.nodes).set(newNode.id, newNode);
  const newEdges = new Map(diagram.edges)
    .set(target.source, currentEdge.withTarget(newNode.id))
    .set(
      newNode.id,
      getNewEdge(newNode, currentEdge.target, currentEdge.source),
    );

  diagram.nodes = newNodes;
  diagram.edges = newEdges;

  return newNode;
};
