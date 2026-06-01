import { LogicalOperator } from '../nodes';
import type { RuntimeSpeed } from './runtime.types';

export const DEFAULT_SPEED: RuntimeSpeed = {
  nodeMs: 450,
  edgeMs: 300,
  branchMs: 500,
  contextMs: 200,
};

export const LOGICAL_OPERATOR_EXPRESSION = {
  [LogicalOperator.And]: '&&',
  [LogicalOperator.Or]: '||',
} as const;
