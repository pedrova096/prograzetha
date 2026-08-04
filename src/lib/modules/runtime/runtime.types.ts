import type { Graph } from '~/lib/types';
import type { Expression } from '../expression';
import type { InputType } from '../nodes';

export type RuntimeContext = {
  variables: Record<string, unknown>;
};

export type RuntimeSpeed = {
  nodeMs: number;
  edgeMs: number;
  branchMs: number;
  contextMs: number;
};

export type GetRuntimeProgramOptions = Graph;

// #region Runtime Actions
export enum RuntimeActions {
  Noop = 'noop',
  Alert = 'alert',
  Input = 'input',
  Assign = 'assign',
}

export type RuntimeAction =
  | { type: RuntimeActions.Noop }
  | { type: RuntimeActions.Alert; message: string; expression?: Expression }
  | {
      type: RuntimeActions.Input;
      variable: string;
      inputType: `${InputType}`;
    }
  | { type: RuntimeActions.Assign; variable: string; expression: Expression };
// #endregion

// #region Runtime Events
export enum RuntimeEvents {
  NodeProcess = 'node:process',
  EdgeTraverse = 'edge:traverse',
  BranchChoose = 'branch:choose',
  ActionAlert = 'action:alert',
  ActionInput = 'action:input',
  ContextUpdate = 'context:update',
  ExecutionEnd = 'execution:end',
}

export type RuntimeEvent =
  | { type: RuntimeEvents.NodeProcess; nodeId: string }
  | { type: RuntimeEvents.EdgeTraverse; from: string; to: string }
  | {
      type: RuntimeEvents.BranchChoose;
      nodeId: string;
      branch: 'then' | 'else';
    }
  | { type: RuntimeEvents.ActionAlert; nodeId: string; message: string }
  | {
      type: RuntimeEvents.ActionInput;
      nodeId: string;
      variable: string;
      inputType: `${InputType}`;
    }
  | { type: RuntimeEvents.ContextUpdate; variables: Record<string, unknown> }
  | { type: RuntimeEvents.ExecutionEnd };
// #endregion

export type RuntimeServices = {
  output(message: string): Promise<void>;
  inputNumber(): Promise<number>;
  inputText(): Promise<string>;
};

export enum RuntimeNodes {
  Step = 'step',
  Branch = 'branch',
}

export type RuntimeStepNode = {
  id: string;
  type: RuntimeNodes.Step;
  kind: 'start' | 'end' | 'read' | 'operation' | 'write' | 'alert';
  label: string;
  action?: RuntimeAction;
};

export type RuntimeBranchNode = {
  id: string;
  type: RuntimeNodes.Branch;
  label: string;
  condition: Expression;
  then: RuntimeNode[];
  else: RuntimeNode[];
};

export type RuntimeNode = RuntimeStepNode | RuntimeBranchNode;

export enum PlayerStatus {
  Idle = 'idle',
  Running = 'running',
  Paused = 'paused',
  WaitingInput = 'waiting-input',
  Done = 'done',
  Error = 'error',
}

export type PendingInput = {
  nodeId: string;
  variableName: string;
  inputType: `${InputType}`;
};
