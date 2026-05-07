import type { LayoutBlock, LayoutResult, Point, Size } from '../layout.types';
import { BLOCK_HEIGHT, BLOCK_WIDTH } from './block.constants';

export class BlockLayout implements LayoutBlock {
  constructor(
    private readonly id: string,
    private readonly type = 'block',
  ) {}

  public static create(id: string, type?: string): BlockLayout {
    return new BlockLayout(id, type);
  }

  public measure(): Size {
    return {
      width: BLOCK_WIDTH,
      height: BLOCK_HEIGHT,
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
    };
  }
}
