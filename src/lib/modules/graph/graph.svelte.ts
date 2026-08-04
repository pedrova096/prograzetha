import {
  BranchEdge,
  Edge,
  EdgeInsertionTargetType,
  LoopEdge,
} from '../edge';
import type { EdgeInsertionTarget } from '../edge';
import {
  EndNode,
  Node,
  NodeTypes,
  StartNode,
  createNode,
} from '../nodes';
import type { Graph as GraphData } from '~/lib/types';
import type { GraphHistoryState, GraphState } from './graph.types';
import {
  createSnapshotHistory,
  recordSnapshot,
  redoSnapshot,
  undoSnapshot,
  type SnapshotHistory,
} from './history';

const outgoingNodeIds = (edge: Edge): string[] => {
  if (edge instanceof BranchEdge) {
    return [edge.left, edge.right, edge.target];
  }

  if (edge instanceof LoopEdge) {
    return [edge.body, edge.target];
  }

  return [edge.target];
};

const collectOwnedNodes = (
  graph: GraphData,
  starts: string[],
  stopId: string,
) => {
  const owned = new Set<string>();
  const pending = [...starts];

  while (pending.length) {
    const id = pending.pop()!;

    if (!id || id === stopId || owned.has(id) || !graph.nodes.has(id)) {
      continue;
    }

    owned.add(id);

    const edge = graph.edges.get(id);
    if (edge) pending.push(...outgoingNodeIds(edge));
  }

  return owned;
};

const replaceRemovedReference = (
  value: string,
  removed: Set<string>,
  replacement: string,
) => (removed.has(value) ? replacement : value);

const rewireEdge = (
  edge: Edge,
  removed: Set<string>,
  target: string,
  previous: string,
): Edge => {
  const nextTarget = replaceRemovedReference(edge.target, removed, target);
  const nextPrevious = replaceRemovedReference(
    edge.previous,
    removed,
    previous,
  );

  if (edge instanceof BranchEdge) {
    return new BranchEdge(
      edge.source,
      nextTarget,
      nextPrevious,
      replaceRemovedReference(edge.left, removed, target),
      replaceRemovedReference(edge.right, removed, target),
    );
  }

  if (edge instanceof LoopEdge) {
    return new LoopEdge(
      edge.source,
      nextTarget,
      nextPrevious,
      replaceRemovedReference(edge.body, removed, target),
    );
  }

  return edge.withUpdate(nextTarget, nextPrevious);
};

export const deleteNodeFromGraph = (
  graph: GraphData,
  nodeId: string,
): GraphData | null => {
  const node = graph.nodes.get(nodeId);
  const edge = graph.edges.get(nodeId);

  if (
    !node ||
    !edge ||
    node.type === NodeTypes.Start ||
    node.type === NodeTypes.End
  ) {
    return null;
  }

  const removed = new Set([nodeId]);

  if (edge instanceof BranchEdge) {
    for (const id of collectOwnedNodes(
      graph,
      [edge.left, edge.right],
      edge.target,
    )) {
      removed.add(id);
    }
  } else if (edge instanceof LoopEdge) {
    for (const id of collectOwnedNodes(graph, [edge.body], nodeId)) {
      removed.add(id);
    }
  }

  const nodes = new Map(graph.nodes);
  const edges = new Map<string, Edge>();

  for (const id of removed) nodes.delete(id);

  for (const [id, currentEdge] of graph.edges) {
    if (!removed.has(id)) {
      edges.set(
        id,
        rewireEdge(currentEdge, removed, edge.target, edge.previous),
      );
    }
  }

  return { nodes, edges };
};

const createInitialState = (): GraphState => {
  const startNode = StartNode.create();
  const endNode = EndNode.create();

  return {
    nodes: new Map<string, Node>([
      [startNode.id, startNode],
      [endNode.id, endNode],
    ]),
    edges: new Map<string, Edge>([
      [startNode.id, Edge.create(startNode.id, endNode.id)],
    ]),
    start: startNode.id,
  };
};

export class Graph {
  private readonly initialState = createInitialState();
  private snapshots: SnapshotHistory<GraphState> = createSnapshotHistory();

  nodes = $state(this.initialState.nodes);
  edges = $state(this.initialState.edges);
  start = $state(this.initialState.start);
  history = $state<GraphHistoryState>({
    canUndo: false,
    canRedo: false,
  });

  private syncHistoryState() {
    this.history.canUndo = this.snapshots.past.length > 0;
    this.history.canRedo = this.snapshots.future.length > 0;
  }

  private snapshot(): GraphState {
    return {
      nodes: this.nodes,
      edges: this.edges,
      start: this.start,
    };
  }

  private restore(next: GraphState) {
    this.nodes = next.nodes;
    this.edges = next.edges;
    this.start = next.start;
  }

  private record() {
    this.snapshots = recordSnapshot(this.snapshots, this.snapshot());
    this.syncHistoryState();
  }

  updateNode = (node: Node) => {
    if (this.nodes.get(node.id) === node) return false;

    this.record();
    this.nodes = new Map(this.nodes).set(node.id, node);
    return true;
  };

  replace = (next: GraphState) => {
    this.record();
    this.restore(next);
  };

  deleteNode = (nodeId: string) => {
    const next = deleteNodeFromGraph(this, nodeId);
    if (!next) return false;

    this.record();
    this.nodes = next.nodes;
    this.edges = next.edges;
    return true;
  };

  undo = () => {
    const result = undoSnapshot(this.snapshots, this.snapshot());
    if (!result) return false;

    this.snapshots = result.history;
    this.restore(result.value);
    this.syncHistoryState();
    return true;
  };

  redo = () => {
    const result = redoSnapshot(this.snapshots, this.snapshot());
    if (!result) return false;

    this.snapshots = result.history;
    this.restore(result.value);
    this.syncHistoryState();
    return true;
  };

  private getNewEdge(newNode: Node, target: string, previous: string) {
    const baseEdge = Edge.create(newNode.id, target, previous);

    return newNode.type === NodeTypes.Condition
      ? BranchEdge.fromEdge(baseEdge)
      : baseEdge;
  }

  private attachBranchNode(
    target: Extract<
      EdgeInsertionTarget,
      { type: EdgeInsertionTargetType.Branch }
    >,
    currentEdge: BranchEdge,
    newNode: Node,
  ) {
    const branchTarget = currentEdge[target.side];
    const nodes = new Map(this.nodes).set(newNode.id, newNode);
    const edges = new Map(this.edges)
      .set(target.source, currentEdge.withBranchSide(target.side, newNode.id))
      .set(
        newNode.id,
        this.getNewEdge(newNode, branchTarget, currentEdge.source),
      );

    if (branchTarget) {
      edges.set(
        branchTarget,
        this.edges.get(branchTarget)!.withPrevious(newNode.id),
      );
    }

    this.nodes = nodes;
    this.edges = edges;
    return newNode;
  }

  attachNewNode = (
    target: EdgeInsertionTarget,
    newNodeType: NodeTypes,
  ) => {
    const currentEdge = this.edges.get(target.source);

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

      this.record();
      return this.attachBranchNode(target, currentEdge, newNode);
    }

    this.record();
    this.nodes = new Map(this.nodes).set(newNode.id, newNode);
    this.edges = new Map(this.edges)
      .set(target.source, currentEdge.withTarget(newNode.id))
      .set(
        newNode.id,
        this.getNewEdge(newNode, currentEdge.target, currentEdge.source),
      );

    return newNode;
  };
}
