import {
  ConditionalNode,
  EndNode,
  InputNode,
  Node,
  OperationNode,
  OutputNode,
  StartNode,
} from '~/lib/modules/nodes';
import { BranchEdge, Edge } from './lib/modules/edge';

export const START_NODE = StartNode.create();
export const INPUT_NODE = InputNode.create();
export const OPERATION_NODE = OperationNode.create();
export const CONDITION_NODE = ConditionalNode.create();
export const CONDITION_INPUT_LEFT_NODE = InputNode.create();
export const CONDITION_INPUT_RIGHT_NODE = InputNode.create();
export const CONDITION_LOGIC_RIGHT_NODE = OperationNode.create();

export const C2_NODE = ConditionalNode.create();
export const C2_INPUT_LEFT_NODE = InputNode.create();
export const C2_INPUT_RIGHT_NODE = InputNode.create();

export const OUTPUT_NODE = OutputNode.create();
export const END_NODE = EndNode.create();

export const NODES = new Map<string, Node>([
  [START_NODE.id, START_NODE],
  [INPUT_NODE.id, INPUT_NODE],
  [OPERATION_NODE.id, OPERATION_NODE],
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

export const EDGES = new Map<string, Edge>([
  [START_NODE.id, Edge.create(START_NODE.id, INPUT_NODE.id)],
  [INPUT_NODE.id, Edge.create(INPUT_NODE.id, OPERATION_NODE.id)],
  [OPERATION_NODE.id, Edge.create(OPERATION_NODE.id, CONDITION_NODE.id)],
  [
    CONDITION_NODE.id,
    BranchEdge.create(
      CONDITION_NODE.id,
      OUTPUT_NODE.id,
      CONDITION_INPUT_LEFT_NODE.id,
      CONDITION_INPUT_RIGHT_NODE.id,
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
    BranchEdge.create(
      C2_NODE.id,
      '',
      C2_INPUT_LEFT_NODE.id,
      C2_INPUT_RIGHT_NODE.id,
    ),
  ],
  [OUTPUT_NODE.id, Edge.create(OUTPUT_NODE.id, END_NODE.id)],
]);
