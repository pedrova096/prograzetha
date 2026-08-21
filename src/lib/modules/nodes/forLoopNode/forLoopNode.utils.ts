import type { ForLoopNodeData } from './forLoopNode.types';

export const createDefaultForLoopData = (): ForLoopNodeData => ({
  iterator: 'i',
  start: 0,
  end: 10,
  step: 1,
});
