import { createId } from '@paralleldrive/cuid2';

enum NodeTypes {
  Start = 'Start',
  End = 'End',
  Input = 'Input',
  Output = 'Output',
  Condition = 'Condition',
  Logical = 'Logical',
}

class Node {
  id: string;
  type: NodeTypes;
  x: number;
  y: number;

  private constructor(type: NodeTypes, x: number = 0, y: number = 0) {
    this.id = createId();
    this.type = type;
    this.x = x;
    this.y = y;
  }

  static create(type: NodeTypes, x: number = 0, y: number = 0): Node {
    return new Node(type, x, y);
  }
}

class Edge {
  from: string;
  to: string;

  private constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
  }

  static create(from: string, to: string): Edge {
    return new Edge(from, to);
  }
}

export const INPUT_NODE = Node.create(NodeTypes.Input);
export const START_NODE = Node.create(NodeTypes.Start);
export const LOGICAL_NODE = Node.create(NodeTypes.Logical);
export const OUTPUT_NODE = Node.create(NodeTypes.Output);
export const END_NODE = Node.create(NodeTypes.End);

export const NODES = new Map<string, Node>([
  [START_NODE.id, START_NODE],
  [INPUT_NODE.id, INPUT_NODE],
  [LOGICAL_NODE.id, LOGICAL_NODE],
  [OUTPUT_NODE.id, OUTPUT_NODE],
  [END_NODE.id, END_NODE],
]);

export const EDGES = new Map<string, Edge>([
  [START_NODE.id, Edge.create(START_NODE.id, INPUT_NODE.id)],
  [INPUT_NODE.id, Edge.create(INPUT_NODE.id, LOGICAL_NODE.id)],
  [LOGICAL_NODE.id, Edge.create(LOGICAL_NODE.id, OUTPUT_NODE.id)],
  [OUTPUT_NODE.id, Edge.create(OUTPUT_NODE.id, END_NODE.id)],
]);
