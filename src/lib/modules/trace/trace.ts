import type { Recordable } from '~/lib/types';

import { TraceStatus } from './trace.types';
import type { TraceRunOptions } from './trace.types';

export class TraceBlock {
  constructor(
    public status: TraceStatus,
    public entry: Recordable | null = null,
  ) {}

  public static create(
    status: TraceStatus = TraceStatus.Done,
    entry: Recordable | null = null,
  ) {
    return new TraceBlock(status, entry);
  }
}

export class TraceCallbackBlock extends TraceBlock {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(options: TraceRunOptions) {}
}
