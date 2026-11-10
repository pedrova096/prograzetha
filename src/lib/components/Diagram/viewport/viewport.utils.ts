import type { Point } from '~/lib/modules/layout';
import type { FitViewportOptions, ViewportState } from './viewport.types';

export const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

export const zoomAroundPoint = (
  viewport: ViewportState,
  nextZoom: number,
  point: Point,
): ViewportState => {
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
};

export const fitDiagramToViewport = ({
  viewportWidth,
  viewportHeight,
  diagramWidth,
  diagramHeight,
  padding,
  minimumZoom,
  maximumZoom,
}: FitViewportOptions): ViewportState => {
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
};
