export enum OperationKind {
  Success = 'success',
  Error = 'error',
}

export type OperationStateProps =
  | { kind: OperationKind.Success; message: string }
  | { kind: OperationKind.Error; message: string };

export type OperationUnion = OperationStateProps;
