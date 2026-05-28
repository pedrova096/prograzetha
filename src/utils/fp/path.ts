export type PathSegment = string | number;
type PathTarget = Record<PropertyKey, unknown> | readonly unknown[];

const getPathValue = <T = unknown>(
  segments: readonly PathSegment[],
  target: unknown,
) => {
  return segments.reduce<unknown>((value, segment) => {
    if (value == null) return undefined;

    return (value as PathTarget)[segment as any];
  }, target) as T | undefined;
};

export function path<T = unknown>(
  segments: readonly PathSegment[],
): (target: unknown) => T | undefined;
export function path<T = unknown>(
  segments: readonly PathSegment[],
  target: unknown,
): T | undefined;
export function path<T = unknown>(
  segments: readonly PathSegment[],
  target?: unknown,
) {
  if (arguments.length === 1) {
    return (nextTarget: unknown) => getPathValue<T>(segments, nextTarget);
  }

  return getPathValue<T>(segments, target);
}
