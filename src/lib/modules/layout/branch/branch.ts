import type {
  LayoutBlock,
  LayoutResult,
  Point,
  RenderEdge,
  Size,
} from '../layout.types';
import {
  BRANCH_GAP_X,
  BRANCH_GAP_Y,
  BRANCH_JOIN_GAP_Y,
} from './branch.constants';
import type { BranchLayoutOptions } from './branch.types';
import { elbowEdge, joinEdge } from './branch.utils';

export class BranchLayout implements LayoutBlock {
  private readonly gapX: number;
  private readonly gapY: number;
  private readonly joinGapY: number;

  constructor(private readonly options: BranchLayoutOptions) {
    const {
      gapX = BRANCH_GAP_X,
      gapY = BRANCH_GAP_Y,
      joinGapY = BRANCH_JOIN_GAP_Y,
    } = options;

    this.gapX = gapX;
    this.gapY = gapY;
    this.joinGapY = joinGapY;
  }

  public static create(options: BranchLayoutOptions): BranchLayout {
    return new BranchLayout(options);
  }

  public measure(): Size {
    const conditionSize = this.options.condition.measure();
    const thenSize = this.options.then.measure();
    const elseSize = this.options.else.measure();

    const branchesTotalWidth = thenSize.width + this.gapX + elseSize.width;
    const branchesMaxHeight = Math.max(thenSize.height, elseSize.height);

    return {
      width: Math.max(conditionSize.width, branchesTotalWidth),
      height:
        conditionSize.height + this.gapY + branchesMaxHeight + this.joinGapY,
    };
  }

  public layout(origin: Point): LayoutResult {
    const size = this.measure();

    const conditionSize = this.options.condition.measure();
    const thenSize = this.options.then.measure();
    const elseSize = this.options.else.measure();

    const branchesTotalWidth = thenSize.width + this.gapX + elseSize.width;

    const branchesX = origin.x + (size.width - branchesTotalWidth) / 2;
    const branchesY = origin.y + conditionSize.height + this.gapY;

    const conditionOrigin: Point = {
      x: origin.x + size.width / 2 - conditionSize.width / 2,
      y: origin.y,
    };

    const thenOrigin: Point = {
      x: branchesX,
      y: branchesY,
    };

    const elseOrigin: Point = {
      x: branchesX + thenSize.width + this.gapX,
      y: branchesY,
    };

    const conditionResult = this.options.condition.layout(conditionOrigin);
    const thenResult = this.options.then.layout(thenOrigin);
    const elseResult = this.options.else.layout(elseOrigin);

    const joinPoint: Point = {
      x: origin.x + size.width / 2,
      y: branchesY + Math.max(thenSize.height, elseSize.height) + this.joinGapY,
    };

    const edges: RenderEdge[] = [
      ...conditionResult.edges,
      ...thenResult.edges,
      ...elseResult.edges,
      {
        id: `${this.options.id}.condition-then`,
        points: elbowEdge(
          conditionResult.anchors.output,
          thenResult.anchors.input,
        ),
      },
      {
        id: `${this.options.id}.condition-else`,
        points: elbowEdge(
          conditionResult.anchors.output,
          elseResult.anchors.input,
        ),
      },
      {
        id: `${this.options.id}.then-join`,
        points: joinEdge(thenResult.anchors.output, joinPoint),
        isJoin: true,
      },
      {
        id: `${this.options.id}.else-join`,
        points: joinEdge(elseResult.anchors.output, joinPoint),
        isJoin: true,
      },
    ];

    return {
      box: {
        x: origin.x,
        y: origin.y,
        width: size.width,
        height: size.height,
      },
      nodes: [
        ...conditionResult.nodes,
        ...thenResult.nodes,
        ...elseResult.nodes,
      ],
      edges,
      anchors: {
        input: conditionResult.anchors.input,
        output: joinPoint,
      },
    };
  }
}
