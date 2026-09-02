import { describe, expect, test } from 'bun:test';

import {
  fitDiagramToViewport,
  zoomAroundPoint,
} from '../src/lib/components/Diagram/Diagram.utils';

describe('diagram viewport', () => {
  test('fits and centers a diagram inside the available viewport', () => {
    expect(
      fitDiagramToViewport({
        viewportWidth: 1000,
        viewportHeight: 800,
        diagramWidth: 500,
        diagramHeight: 1000,
        padding: 50,
        minimumZoom: 0.35,
        maximumZoom: 2,
      }),
    ).toEqual({
      zoom: 0.7,
      pan: { x: 325, y: 50 },
    });
  });

  test('does not enlarge a small diagram when fitting it', () => {
    expect(
      fitDiagramToViewport({
        viewportWidth: 1000,
        viewportHeight: 800,
        diagramWidth: 400,
        diagramHeight: 300,
        padding: 50,
        minimumZoom: 0.35,
        maximumZoom: 2,
      }).zoom,
    ).toBe(1);
  });

  test('keeps the diagram point under the cursor fixed while zooming', () => {
    const point = { x: 300, y: 200 };
    const before = { pan: { x: 100, y: 50 }, zoom: 1 };
    const after = zoomAroundPoint(before, 1.5, point);

    expect(after).toEqual({
      zoom: 1.5,
      pan: { x: 0, y: -25 },
    });
    expect((point.x - after.pan.x) / after.zoom).toBe(
      (point.x - before.pan.x) / before.zoom,
    );
    expect((point.y - after.pan.y) / after.zoom).toBe(
      (point.y - before.pan.y) / before.zoom,
    );
  });
});
