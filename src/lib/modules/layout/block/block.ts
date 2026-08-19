import type { LayoutBlock, LayoutResult, Point, Size } from '../layout.types';
import { BLOCK_HEIGHT, BLOCK_WIDTH } from './block.constants';

export class BlockLayout implements LayoutBlock {
  constructor(
    private readonly id: string,
    private readonly type = 'block',
    private readonly width = BLOCK_WIDTH,
    private readonly height = BLOCK_HEIGHT,
  ) {}

  public static create(
    id: string,
    type?: string,
    width?: number,
    height?: number,
  ): BlockLayout {
    return new BlockLayout(id, type, width, height);
  }

  public measure(): Size {
    return {
      width: this.width,
      height: this.height,
    };
  }

  public layout(origin: Point): LayoutResult {
    const { width, height } = this.measure();

    return {
      box: {
        x: origin.x,
        y: origin.y,
        width,
        height,
      },
      nodes: [
        {
          id: this.id,
          type: this.type,
          x: origin.x,
          y: origin.y,
          width,
          height,
        },
      ],
      edges: [],
      anchors: {
        input: {
          x: origin.x + width / 2,
          y: origin.y,
        },
        output: {
          x: origin.x + width / 2,
          y: origin.y + height,
        },
      },
      outputSource: this.id,
    };
  }
}
