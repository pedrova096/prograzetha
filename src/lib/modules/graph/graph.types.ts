import type { Edge } from '../edge';
import type { Node } from '../nodes';

export type GraphState = {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
  start: string;
};

export type GraphHistoryState = {
  canUndo: boolean;
  canRedo: boolean;
};

export enum HistoryAction {
  Undo = 'undo',
  Redo = 'redo',
}
