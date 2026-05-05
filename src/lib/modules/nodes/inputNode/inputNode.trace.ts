import {
  TraceBlock,
  TraceCallbackBlock,
  TraceStatus,
  type TraceRunOptions,
} from '~/lib/modules/trace';
import type { InputNodeData } from './inputNode.types';

export class InputTraceCallbackNode extends TraceCallbackBlock {
  private data: InputNodeData;

  constructor(data: InputNodeData) {
    super(TraceStatus.Running);
    this.data = data;
  }

  run(options: TraceRunOptions) {
    const { io, callback } = options;

    io.read({
      title: 'Leer variable',
      message: 'Ingrese el valor de la variable',
      type: this.data.type,
      callback: (value) => {
        this.status = TraceStatus.Done;
        callback(
          TraceBlock.create(TraceStatus.Done, { [this.data.variable]: value }),
        );
      },
    });
  }
}
