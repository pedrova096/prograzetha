import type { LayoutResult, RenderEdge } from '../layout.types';
import { verticalEdge } from '../branch/branch.utils';

export function connectVertical(
  id: string,
  results: LayoutResult[],
): RenderEdge[] {
  const edges: RenderEdge[] = [];

  for (let index = 0; index < results.length - 1; index += 1) {
    const current = results[index];
    const next = results[index + 1];

    edges.push({
      id: `${id}.${index}-${index + 1}`,
      points: verticalEdge(current.anchors.output, next.anchors.input),
    });
  }

  return edges;
}
