export enum BranchEdgeSide {
  Left = 'left',
  Right = 'right',
}

export enum EdgeInsertionTargetType {
  Edge = 'edge',
  Branch = 'branch',
  Loop = 'loop',
}

export type EdgeInsertionTarget =
  | { type: EdgeInsertionTargetType.Edge; source: string }
  | {
      type: EdgeInsertionTargetType.Branch;
      source: string;
      side: BranchEdgeSide;
    }
  | {
      type: EdgeInsertionTargetType.Loop;
      source: string;
    };
