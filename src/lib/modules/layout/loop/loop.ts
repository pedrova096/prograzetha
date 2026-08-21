import type {
  LayoutBlock,
  LayoutResult,
  Point,
  RenderEdge,
  Size,
} from '../layout.types';
import { LOOP_BACK_GAP_X, LOOP_EXIT_GAP_Y, LOOP_GAP_Y } from './loop.constants';
import type { LoopLayoutOptions } from './loop.types';
import { loopBackEdge } from './loop.utils';
import { verticalEdge } from '../branch/branch.utils';
import {
  EdgeInsertionTargetType,
  type EdgeInsertionTarget,
} from '~/lib/modules/edge';

export class LoopLayout implements LayoutBlock {
  private readonly gapY: number;
  private readonly exitGapY: number;
  private readonly backGapX: number;

  constructor(private readonly options: LoopLayoutOptions) {
    const {
      gapY = LOOP_GAP_Y,
      exitGapY = LOOP_EXIT_GAP_Y,
      backGapX = LOOP_BACK_GAP_X,
    } = options;

    this.gapY = gapY;
    this.exitGapY = exitGapY;
    this.backGapX = backGapX;
  }

  public static create(options: LoopLayoutOptions): LoopLayout {
    return new LoopLayout(options);
  }

  public measure(): Size {
    const conditionSize = this.options.condition.measure();
    const bodySize = this.options.body.measure();
    const contentWidth = Math.max(conditionSize.width, bodySize.width);

    return {
      width: contentWidth + this.backGapX * 2,
      height:
        conditionSize.height + this.gapY + bodySize.height + this.exitGapY,
    };
  }

  public layout(origin: Point): LayoutResult {
    const size = this.measure();
    const conditionSize = this.options.condition.measure();
    const bodySize = this.options.body.measure();
    const contentX = origin.x + this.backGapX;
    const contentWidth = size.width - this.backGapX * 2;

    const conditionOrigin: Point = {
      x: contentX + contentWidth / 2 - conditionSize.width / 2,
      y: origin.y,
    };
    const bodyOrigin: Point = {
      x: contentX + contentWidth / 2 - bodySize.width / 2,
      y: origin.y + conditionSize.height + this.gapY,
    };

    const conditionResult = this.options.condition.layout(conditionOrigin);
    const bodyResult = this.options.body.layout(bodyOrigin);
    const conditionMiddleRight: Point = {
      x: conditionResult.box.x + conditionResult.box.width,
      y: conditionResult.box.y + conditionResult.box.height / 2,
    };

    const backX = origin.x + this.backGapX + contentWidth + this.backGapX / 2;
    const bodySource = bodyResult.outputSource || this.options.id;
    const bodyInsertTarget: EdgeInsertionTarget = {
      type: EdgeInsertionTargetType.Loop,
      source: this.options.id,
    };

    const edges: RenderEdge[] = [
      ...conditionResult.edges,
      ...bodyResult.edges,
      {
        id: `${this.options.id}.condition-body`,
        source: this.options.id,
        insertTarget: bodyInsertTarget,
        points: verticalEdge(
          conditionResult.anchors.output,
          bodyResult.anchors.input,
        ),
      },
      {
        id: `${this.options.id}.body-condition`,
        source: bodySource,
        points: loopBackEdge(
          bodyResult.anchors.output,
          conditionMiddleRight,
          backX,
        ),
        isDecorative: true,
      },
    ];

    return {
      box: {
        x: origin.x,
        y: origin.y,
        width: size.width,
        height: size.height,
      },
      nodes: [...conditionResult.nodes, ...bodyResult.nodes],
      edges,
      anchors: {
        input: conditionResult.anchors.input,
        output: bodyResult.anchors.output,
      },
      outputSource: this.options.id,
    };
  }
}
