import type { LayoutBlock, LayoutResult, Point, Size } from '../layout.types';
import { VSTACK_GAP } from './vstack.constants';
import type { VStackLayoutOptions } from './vstack.types';
import { connectVertical } from './vstack.utils';

export class VStackLayout implements LayoutBlock {
  private readonly gap: number;

  constructor(private readonly options: VStackLayoutOptions) {
    this.gap = options.gap ?? VSTACK_GAP;
  }

  public static create(options: VStackLayoutOptions): VStackLayout {
    return new VStackLayout(options);
  }

  public measure(): Size {
    const sizes = this.options.children.map((child) => child.measure());

    if (sizes.length === 0) {
      return {
        width: 0,
        height: 0,
      };
    }

    return {
      width: Math.max(...sizes.map((size) => size.width)),
      height:
        sizes.reduce((sum, size) => sum + size.height, 0) +
        this.gap * (sizes.length - 1),
    };
  }

  public layout(origin: Point): LayoutResult {
    const size = this.measure();

    const { results } = this.options.children.reduce(
      (state, child) => {
        const childSize = child.measure();
        const x = origin.x + (size.width - childSize.width) / 2;
        const result = child.layout({ x, y: state.y });

        return {
          y: state.y + childSize.height + this.gap,
          results: [...state.results, result],
        };
      },
      {
        y: origin.y,
        results: [] as LayoutResult[],
      },
    );

    return {
      box: {
        x: origin.x,
        y: origin.y,
        width: size.width,
        height: size.height,
      },
      nodes: results.flatMap((result) => result.nodes),
      edges: [
        ...results.flatMap((result) => result.edges),
        ...connectVertical(this.options.id, results),
      ],
      anchors: {
        input: results[0]?.anchors.input ?? origin,
        output: results[results.length - 1]?.anchors.output ?? origin,
      },
      outputSource: results[results.length - 1]?.outputSource ?? this.options.id,
    };
  }
}
