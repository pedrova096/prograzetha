import type { Point } from '../layout.types';

export function elbowEdge(from: Point, to: Point): Point[] {
  const midY = from.y + (to.y - from.y) / 2;

  return [from, { x: from.x, y: midY }, { x: to.x, y: midY }, to];
}

export function joinEdge(from: Point, to: Point): Point[] {
  return [from, { x: from.x, y: to.y }, to];
}

export function verticalEdge(from: Point, to: Point): Point[] {
  return [from, to];
}
