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

type BranchEdgeItem = [Node, EdgeTreeItem[], EdgeTreeItem[]];
type EdgeTreeItem = Node | BranchEdgeItem;

const isBranchEdgeItem = (item: EdgeTreeItem): item is BranchEdgeItem =>
  Array.isArray(item);

const getEdgeSource = (item: EdgeTreeItem) => {
  return isBranchEdgeItem(item) ? item[0].id : item.id;
};

const connectEdges = (
  items: EdgeTreeItem[],
  previous = '',
  target = '',
): Edge[] => {
  return items.flatMap((item, index) => {
    const prev = items[index - 1];
    const next = items[index + 1];

    const edgePrev = prev ? getEdgeSource(prev) : previous;
    const edgeTarget = next ? getEdgeSource(next) : target;

    if (!isBranchEdgeItem(item)) {
      return [Edge.create(item.id, edgeTarget, edgePrev)];
    }

    const [condition, thenItems, elseItems] = item;
    const thenSource = thenItems[0] ? getEdgeSource(thenItems[0]) : edgeTarget;
    const elseSource = elseItems[0] ? getEdgeSource(elseItems[0]) : edgeTarget;

    return [
      BranchEdge.create(
        condition.id,
        edgeTarget,
        edgePrev,
        thenSource,
        elseSource,
      ),
      ...connectEdges(thenItems, condition.id),
      ...connectEdges(elseItems, condition.id),
    ];
  });
};

const getEdges = (items: EdgeTreeItem[]) => {
  return connectEdges(items).map((edge) => [edge.source, edge] as const);
};

export const START_NODE = StartNode.create();
export const INPUT_NODE = InputNode.create();
export const OPERATION_NODE = OperationNode.create();
export const CONDITION_NODE = ConditionalNode.create();
export const CONDITION_INPUT_LEFT_NODE = InputNode.create();
export const CONDITION_INPUT_RIGHT_NODE = InputNode.create();
export const CONDITION_OPERATION_RIGHT_NODE = OperationNode.create();

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
  [CONDITION_OPERATION_RIGHT_NODE.id, CONDITION_OPERATION_RIGHT_NODE],
  [C2_NODE.id, C2_NODE],
  [C2_INPUT_LEFT_NODE.id, C2_INPUT_LEFT_NODE],
  [C2_INPUT_RIGHT_NODE.id, C2_INPUT_RIGHT_NODE],
  [OUTPUT_NODE.id, OUTPUT_NODE],
  [END_NODE.id, END_NODE],
]);

export const EDGES = new Map<string, Edge>(
  getEdges([
    START_NODE,
    INPUT_NODE,
    OPERATION_NODE,
    [
      CONDITION_NODE,
      [CONDITION_INPUT_LEFT_NODE],
      [
        CONDITION_INPUT_RIGHT_NODE,
        CONDITION_OPERATION_RIGHT_NODE,
        [C2_NODE, [C2_INPUT_LEFT_NODE], [C2_INPUT_RIGHT_NODE]],
      ],
    ],
    OUTPUT_NODE,
    END_NODE,
  ]),
);
