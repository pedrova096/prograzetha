export enum BranchEdgeSide {
  Left = 'left',
  Right = 'right',
}

export enum EdgeInsertionTargetType {
  Edge = 'edge',
  Branch = 'branch',
}

export type EdgeInsertionTarget =
  | { type: EdgeInsertionTargetType.Edge; source: string }
  | {
      type: EdgeInsertionTargetType.Branch;
      source: string;
      side: BranchEdgeSide;
    };
