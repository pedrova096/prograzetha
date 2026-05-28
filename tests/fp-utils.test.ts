import { describe, expect, test } from 'bun:test';

import { path, updatePath } from '../src/utils/fp';

describe('fp utils', () => {
  test('path reads nested values and supports currying', () => {
    const target = { a: [{ b: 'value' }] };

    expect(path(['a', 0, 'b'], target)).toBe('value');
    expect(path(['a', 0, 'b'])(target)).toBe('value');
    expect(path(['a', 1, 'b'], target)).toBeUndefined();
  });

  test('updatePath immutably replaces nested values', () => {
    const target = { a: [{ b: 'value' }] };
    const next = updatePath(['a', 0, 'b'], 'updated', target);

    expect(next).toEqual({ a: [{ b: 'updated' }] });
    expect(target).toEqual({ a: [{ b: 'value' }] });
    expect(next).not.toBe(target);
    expect(next.a).not.toBe(target.a);
    expect(next.a[0]).not.toBe(target.a[0]);
  });

  test('updatePath accepts an updater function and supports currying', () => {
    const target = { count: 1 };
    const increment = updatePath<number>(['count'], (count = 0) => count + 1);

    expect(increment(target)).toEqual({ count: 2 });
  });
});
