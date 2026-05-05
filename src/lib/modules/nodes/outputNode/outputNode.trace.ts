import type { Recordable } from '~/lib/types';
import {
  TraceBlock,
  TraceCallbackBlock,
  TraceStatus,
  type TraceRunOptions,
} from '~/lib/modules/trace';
import type { OutputNodeData } from './outputNode.types';

export class OutputTraceCallbackNode extends TraceCallbackBlock {
  private data: OutputNodeData;
  private env: Recordable;

  constructor(data: OutputNodeData, env: Recordable) {
    super(TraceStatus.Running);
    this.data = data;
    this.env = env;
  }

  private replaceVariables(text: string) {
    return text.replace(/@(\w+)/g, (_, key) => this.env[key]);
  }

  run(options: TraceRunOptions) {
    const { io, callback } = options;
    const value = this.replaceVariables(this.data.text);

    io.write({
      value,
      callback: () => {
        this.status = TraceStatus.Done;
        callback(TraceBlock.create(TraceStatus.Done));
      },
    });
  }
}
