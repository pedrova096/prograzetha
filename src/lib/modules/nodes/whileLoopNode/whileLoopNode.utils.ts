import { createDefaultConditionalData } from '../conditionalNode';
import type { WhileLoopNodeData } from './whileLoopNode.types';

export const createDefaultWhileLoopData = (): WhileLoopNodeData =>
  createDefaultConditionalData();
