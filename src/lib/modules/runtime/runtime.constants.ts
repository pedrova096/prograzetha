import type { RuntimeSpeed } from './runtime.types';

export const DEFAULT_SPEED: RuntimeSpeed = {
  nodeMs: 50,
  edgeMs: 250,
  branchMs: 500,
  contextMs: 200,
};
