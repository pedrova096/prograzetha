import type { Expression } from 'jsep';
import type { Edge } from '../edge';
import type { Node } from '../nodes';

export type RuntimeContext = {
  variables: Record<string, unknown>;
};

export type RuntimeSpeed = {
  nodeMs: number;
  edgeMs: number;
  branchMs: number;
  contextMs: number;
};

export type GetRuntimeProgramOptions = {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
};

// #region Runtime Actions
export enum RuntimeActions {
  Noop = 'noop',
  Alert = 'alert',
  Input = 'input',
  Assign = 'assign',
}

export type RuntimeAction =
  | { type: RuntimeActions.Noop }
  | { type: RuntimeActions.Alert; message: string }
  | { type: RuntimeActions.Input; variable: string; prompt: string }
  | { type: RuntimeActions.Assign; variable: string; expression: Expression };
// #endregion

// #region Runtime Events
export enum RuntimeEvents {
  NodeStart = 'node:start',
  NodeEnd = 'node:end',
  EdgeTraverse = 'edge:traverse',
  BranchChoose = 'branch:choose',
  ActionAlert = 'action:alert',
  ActionInput = 'action:input',
  ContextUpdate = 'context:update',
  ExecutionEnd = 'execution:end',
}

export type RuntimeEvent =
  | { type: RuntimeEvents.NodeStart; nodeId: string }
  | { type: RuntimeEvents.NodeEnd; nodeId: string }
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
      prompt: string;
    }
  | { type: RuntimeEvents.ContextUpdate; variables: Record<string, unknown> }
  | { type: RuntimeEvents.ExecutionEnd };
// #endregion

export type RuntimeServices = {
  alert(message: string): Promise<void>;
  input(prompt: string): Promise<string | number>;
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
  prompt: string;
  variableName: string;
};
