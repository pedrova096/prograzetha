export enum NodeTypes {
  Start = 'start',
  End = 'end',
  Input = 'input',
  Output = 'output',
  Condition = 'condition',
  Operation = 'operation',
  Loop = 'loop',
}

export enum NodeStates {
  Ok = 'ok',
  New = 'new',
  Error = 'error',
}

export type NodeState = `${NodeStates}`;
