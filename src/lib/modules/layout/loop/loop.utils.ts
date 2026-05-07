import type { Point } from '../layout.types';

export function loopBackEdge(from: Point, to: Point, x: number): Point[] {
  return [from, { x, y: from.y }, { x, y: to.y }, to];
}

export function loopExitEdge(from: Point, to: Point, x: number): Point[] {
  return [from, { x, y: from.y }, { x, y: to.y }, to];
}
