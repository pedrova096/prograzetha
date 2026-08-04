import type { RuntimePlayer } from './lib/modules/runtime';

export type RuntimeState =
  | { kind: 'ready'; runtime: RuntimePlayer }
  | { kind: 'error'; error: Error };

export type RuntimeContext = {
  runtimeState: RuntimeState;
};
