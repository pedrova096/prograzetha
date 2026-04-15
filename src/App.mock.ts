import { createId } from '@paralleldrive/cuid2';

export enum NodeTypes {
  Start = 'Start',
  End = 'End',
  Input = 'Input',
  Output = 'Output',
  Condition = 'Condition',
  Logical = 'Logical',
}

export class Node {
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

export class Edge {
  from: string;
  to: string;

  protected constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
  }

  static create(from: string, to: string, ...args: unknown[]): Edge {
    return new Edge(from, to);
  }
}

class ConditionEdge extends Edge {
  left: string;
  right: string;

  private constructor(from: string, to: string, left: string, right: string) {
    super(from, to);
    this.left = left;
    this.right = right;
  }

  static override create(
    from: string,
    to: string,
    left: string,
    right: string
  ): ConditionEdge {
    return new ConditionEdge(from, to, left, right);
  }
}

export const INPUT_NODE = Node.create(NodeTypes.Input);
export const START_NODE = Node.create(NodeTypes.Start);
export const LOGICAL_NODE = Node.create(NodeTypes.Logical);
export const CONDITION_NODE = Node.create(NodeTypes.Condition);
export const CONDITION_INPUT_LEFT_NODE = Node.create(NodeTypes.Input);
export const CONDITION_INPUT_RIGHT_NODE = Node.create(NodeTypes.Input);
export const CONDITION_LOGIC_RIGHT_NODE = Node.create(NodeTypes.Logical);

export const C2_NODE = Node.create(NodeTypes.Condition);
export const C2_INPUT_LEFT_NODE = Node.create(NodeTypes.Input);
export const C2_INPUT_RIGHT_NODE = Node.create(NodeTypes.Input);

export const OUTPUT_NODE = Node.create(NodeTypes.Output);
export const END_NODE = Node.create(NodeTypes.End);

export const NODES = new Map<string, Node>([
  [START_NODE.id, START_NODE],
  [INPUT_NODE.id, INPUT_NODE],
  [LOGICAL_NODE.id, LOGICAL_NODE],
  [CONDITION_NODE.id, CONDITION_NODE],
  [CONDITION_INPUT_LEFT_NODE.id, CONDITION_INPUT_LEFT_NODE],
  [CONDITION_INPUT_RIGHT_NODE.id, CONDITION_INPUT_RIGHT_NODE],
  [CONDITION_LOGIC_RIGHT_NODE.id, CONDITION_LOGIC_RIGHT_NODE],
  [C2_NODE.id, C2_NODE],
  [C2_INPUT_LEFT_NODE.id, C2_INPUT_LEFT_NODE],
  [C2_INPUT_RIGHT_NODE.id, C2_INPUT_RIGHT_NODE],
  [OUTPUT_NODE.id, OUTPUT_NODE],
  [END_NODE.id, END_NODE],
]);
/*
export const EDGES = new Map<string, Edge>([
  [START_NODE.id, Edge.create(START_NODE.id, INPUT_NODE.id)],
  [INPUT_NODE.id, Edge.create(INPUT_NODE.id, LOGICAL_NODE.id)],
  [LOGICAL_NODE.id, Edge.create(LOGICAL_NODE.id, CONDITION_NODE.id)],
  [
    CONDITION_NODE.id,
    ConditionEdge.create(
      CONDITION_NODE.id,
      OUTPUT_NODE.id,
      CONDITION_INPUT_LEFT_NODE.id,
      CONDITION_INPUT_RIGHT_NODE.id
    ),
  ],
  [
    CONDITION_INPUT_RIGHT_NODE.id,
    Edge.create(CONDITION_INPUT_RIGHT_NODE.id, CONDITION_LOGIC_RIGHT_NODE.id),
  ],
  [OUTPUT_NODE.id, Edge.create(OUTPUT_NODE.id, END_NODE.id)],
]);
*/

export const EDGES = new Map<string, Edge>([
  [START_NODE.id, Edge.create(START_NODE.id, INPUT_NODE.id)],
  [INPUT_NODE.id, Edge.create(INPUT_NODE.id, LOGICAL_NODE.id)],
  [LOGICAL_NODE.id, Edge.create(LOGICAL_NODE.id, CONDITION_NODE.id)],
  [
    CONDITION_NODE.id,
    ConditionEdge.create(
      CONDITION_NODE.id,
      OUTPUT_NODE.id,
      CONDITION_INPUT_LEFT_NODE.id,
      CONDITION_INPUT_RIGHT_NODE.id
    ),
  ],
  [
    CONDITION_INPUT_RIGHT_NODE.id,
    Edge.create(CONDITION_INPUT_RIGHT_NODE.id, CONDITION_LOGIC_RIGHT_NODE.id),
  ],
  [
    CONDITION_LOGIC_RIGHT_NODE.id,
    Edge.create(CONDITION_LOGIC_RIGHT_NODE.id, C2_NODE.id),
  ],
  [
    C2_NODE.id,
    ConditionEdge.create(
      C2_NODE.id,
      '',
      C2_INPUT_LEFT_NODE.id,
      C2_INPUT_RIGHT_NODE.id
    ),
  ],

  [OUTPUT_NODE.id, Edge.create(OUTPUT_NODE.id, END_NODE.id)],
]);
