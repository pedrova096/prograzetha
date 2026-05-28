import { path, type PathSegment } from './path';

type PathTarget = Record<PropertyKey, unknown> | readonly unknown[];
type UpdatePathValue<T = unknown> = T | ((currentValue: T | undefined) => T);

const cloneWithPathValue = <T>(
  target: unknown,
  segments: readonly PathSegment[],
  value: UpdatePathValue<T>,
) => {
  if (segments.length === 0) {
    return typeof value === 'function'
      ? (value as (currentValue: unknown) => T)(target)
      : value;
  }

  const [segment, ...restSegments] = segments;
  const source = target ?? (typeof segment === 'number' ? [] : {});
  const next = Array.isArray(source)
    ? [...source]
    : { ...(source as Record<PropertyKey, unknown>) };
  const currentValue = (source as PathTarget)[segment as any];

  (next as Record<PropertyKey, unknown>)[segment] = cloneWithPathValue(
    currentValue,
    restSegments,
    value,
  );

  return next;
};

export function updatePath<T = unknown>(
  segments: readonly PathSegment[],
  value: UpdatePathValue<T>,
): <R>(target: R) => R;
export function updatePath<T = unknown, R = unknown>(
  segments: readonly PathSegment[],
  value: UpdatePathValue<T>,
  target: R,
): R;
export function updatePath<T = unknown, R = unknown>(
  segments: readonly PathSegment[],
  value: UpdatePathValue<T>,
  target?: R,
) {
  if (arguments.length === 2) {
    return (nextTarget: R) => updatePath(segments, value, nextTarget);
  }

  const currentValue = path<T>(segments, target);
  const nextValue =
    typeof value === 'function'
      ? (value as (currentValue: T | undefined) => T)(currentValue)
      : value;

  return cloneWithPathValue(target, segments, nextValue);
}
