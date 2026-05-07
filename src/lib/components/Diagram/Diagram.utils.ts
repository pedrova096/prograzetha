import type { Point } from '~/lib/modules/layout';

const DEFAULT_CORNER_RADIUS = 8;

const distance = (a: Point, b: Point) => {
  return Math.hypot(b.x - a.x, b.y - a.y);
};

const roundedCorner = (previous: Point, current: Point, next: Point) => {
  const previousDistance = distance(previous, current);
  const nextDistance = distance(current, next);
  const radius = Math.min(
    DEFAULT_CORNER_RADIUS,
    previousDistance / 2,
    nextDistance / 2,
  );

  if (radius === 0) {
    return `L ${current.x} ${current.y}`;
  }

  const before = {
    x: current.x + ((previous.x - current.x) / previousDistance) * radius,
    y: current.y + ((previous.y - current.y) / previousDistance) * radius,
  };
  const after = {
    x: current.x + ((next.x - current.x) / nextDistance) * radius,
    y: current.y + ((next.y - current.y) / nextDistance) * radius,
  };

  return `L ${before.x} ${before.y} Q ${current.x} ${current.y} ${after.x} ${after.y}`;
};

export function roundedEdgePath(points: Point[]) {
  if (points.length === 0) {
    return '';
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  const [first, ...rest] = points;

  return rest.reduce((path, point, index) => {
    const previous = points[index];
    const next = points[index + 2];

    if (!next) {
      return `${path} L ${point.x} ${point.y}`;
    }

    return `${path} ${roundedCorner(previous, point, next)}`;
  }, `M ${first.x} ${first.y}`);
}
