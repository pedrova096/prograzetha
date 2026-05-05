import type { TraceBlock } from "./trace";

export enum TraceStatus {
  Idle = "idle",
  Running = "running",
  Done = "done",
  Error = "error",
}

interface IOReadOptions {
  title?: string;
  message?: string;
  callback: (value: string | number) => void;
  type?: "number" | "string";
}

interface IOWriteOptions {
  title?: string;
  value: string;
  callback: VoidFunction;
}

export interface IO {
  read: (options: IOReadOptions) => void;
  write: (options: IOWriteOptions) => void;
}

export interface TraceRunOptions {
  io: IO;
  callback: (traceBlock: TraceBlock) => void;
}
