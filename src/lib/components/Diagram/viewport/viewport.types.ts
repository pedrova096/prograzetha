import type { Point } from '~/lib/modules/layout';

export type ViewportState = {
  pan: Point;
  zoom: number;
};

export type FitViewportOptions = {
  viewportWidth: number;
  viewportHeight: number;
  diagramWidth: number;
  diagramHeight: number;
  padding: number;
  minimumZoom: number;
  maximumZoom: number;
};
