import type { Point } from '~/lib/modules/layout';

export type DiagramViewport = {
  pan: Point;
  zoom: number;
};

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

export function edgeMidpoint(points: Point[]) {
  if (points.length === 0) {
    return { x: 0, y: 0 };
  }

  if (points.length === 1) {
    return points[0];
  }

  const segments = points.slice(0, -1).map((point, index) => {
    const next = points[index + 1];

    return {
      from: point,
      to: next,
      length: distance(point, next),
    };
  });
  const totalLength = segments.reduce((sum, segment) => {
    return sum + segment.length;
  }, 0);

  if (totalLength === 0) {
    return points[0];
  }

  const midpointLength = totalLength / 2;

  let travelled = 0;

  for (const segment of segments) {
    if (travelled + segment.length >= midpointLength) {
      if (segment.length === 0) {
        return segment.from;
      }

      const progress = (midpointLength - travelled) / segment.length;

      return {
        x: segment.from.x + (segment.to.x - segment.from.x) * progress,
        y: segment.from.y + (segment.to.y - segment.from.y) * progress,
      };
    }

    travelled += segment.length;
  }

  return points[points.length - 1];
}

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function zoomAroundPoint(
  viewport: DiagramViewport,
  nextZoom: number,
  point: Point,
): DiagramViewport {
  const diagramPoint = {
    x: (point.x - viewport.pan.x) / viewport.zoom,
    y: (point.y - viewport.pan.y) / viewport.zoom,
  };

  return {
    zoom: nextZoom,
    pan: {
      x: point.x - diagramPoint.x * nextZoom,
      y: point.y - diagramPoint.y * nextZoom,
    },
  };
}

export function fitDiagramToViewport({
  viewportWidth,
  viewportHeight,
  diagramWidth,
  diagramHeight,
  padding,
  minimumZoom,
  maximumZoom,
}: {
  viewportWidth: number;
  viewportHeight: number;
  diagramWidth: number;
  diagramHeight: number;
  padding: number;
  minimumZoom: number;
  maximumZoom: number;
}): DiagramViewport {
  const availableWidth = Math.max(0, viewportWidth - padding * 2);
  const availableHeight = Math.max(0, viewportHeight - padding * 2);
  const zoom = clamp(
    Math.min(availableWidth / diagramWidth, availableHeight / diagramHeight, 1),
    minimumZoom,
    maximumZoom,
  );

  return {
    zoom,
    pan: {
      x: (viewportWidth - diagramWidth * zoom) / 2,
      y: (viewportHeight - diagramHeight * zoom) / 2,
    },
  };
}
