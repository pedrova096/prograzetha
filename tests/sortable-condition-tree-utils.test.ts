import { describe, expect, test } from 'bun:test';

import {
  ConditionOperator,
  LogicalOperator,
  type ConditionNode,
  type ConditionRoot,
  type ConditionTree,
} from '../src/lib/modules/nodes';
import {
  addConditionChildAtPath,
  moveCondition,
  parsePath,
  removeConditionAtPath,
  updateConditionAtPath,
} from '../src/lib/components/SidebarDrawer/ConditionalDrawer/SortableConditionTree/SortableConditionTree.utils';

const condition = (id: string, leftSide = id): ConditionNode => ({
  id,
  leftSide,
  rightSide: `${id}-value`,
  operator: ConditionOperator.Equals,
});

const group = (id: string, children: ConditionRoot[]): ConditionTree => ({
  id,
  logicalOperator: LogicalOperator.And,
  children,
});

const createTree = () =>
  group('root', [
    condition('a'),
    group('b', [condition('b1'), condition('b2')]),
    condition('c'),
  ]);

describe('SortableConditionTree utils', () => {
  test('parsePath converts dotted paths into ids', () => {
    expect(parsePath('a.b.c')).toEqual(['a', 'b', 'c']);
    expect(parsePath('.a..b.')).toEqual(['a', 'b']);
    expect(parsePath()).toEqual([]);
  });

  test('addConditionChildAtPath appends a child to a condition group', () => {
    const root = createTree();
    const child = condition('b3');
    const next = addConditionChildAtPath(root, ['b'], child);

    expect(next).not.toBe(root);
    expect((next as ConditionTree).children[1]).toEqual(
      group('b', [condition('b1'), condition('b2'), child]),
    );
    expect((root.children[1] as ConditionTree).children).toHaveLength(2);
  });

  test('addConditionChildAtPath ignores paths that resolve to condition nodes', () => {
    const root = createTree();

    expect(addConditionChildAtPath(root, ['a'], condition('a1'))).toBe(root);
  });

  test('updateConditionAtPath replaces the condition at the requested path', () => {
    const root = createTree();
    const replacement = {
      ...condition('b2', 'updated-left-side'),
      operator: ConditionOperator.NotEquals,
    };

    const next = updateConditionAtPath(root, ['b', 'b2'], replacement);
    const updatedGroup = (next as ConditionTree).children[1] as ConditionTree;

    expect(updatedGroup.children[1]).toEqual(replacement);
    expect((root.children[1] as ConditionTree).children[1]).toEqual(
      condition('b2'),
    );
  });

  test('removeConditionAtPath removes a nested condition', () => {
    const root = createTree();

    const next = removeConditionAtPath(root, ['b', 'b1']);
    const updatedGroup = (next as ConditionTree).children[1] as ConditionTree;

    expect(updatedGroup.children).toEqual([condition('b2')]);
    expect((root.children[1] as ConditionTree).children).toEqual([
      condition('b1'),
      condition('b2'),
    ]);
  });

  test('moveCondition reorders conditions in the same group', () => {
    const root = createTree();

    const next = moveCondition(root, {
      fromPath: [],
      toPath: [],
      oldIndex: 0,
      newIndex: 2,
    });

    expect((next as ConditionTree).children.map((child) => child.id)).toEqual([
      'b',
      'a',
      'c',
    ]);
    expect(root.children.map((child) => child.id)).toEqual(['a', 'b', 'c']);
  });

  test('moveCondition moves a condition between groups', () => {
    const root = createTree();

    const next = moveCondition(root, {
      fromPath: [],
      toPath: ['b'],
      oldIndex: 2,
      newIndex: 1,
    });
    const updatedGroup = (next as ConditionTree).children[1] as ConditionTree;

    expect((next as ConditionTree).children.map((child) => child.id)).toEqual([
      'a',
      'b',
    ]);
    expect(updatedGroup.children.map((child) => child.id)).toEqual([
      'b1',
      'c',
      'b2',
    ]);
  });

  test('moveCondition prevents moving a group into one of its descendants', () => {
    const root = createTree();

    const next = moveCondition(root, {
      fromPath: [],
      toPath: ['b'],
      oldIndex: 1,
      newIndex: 0,
    });

    expect(next).toBe(root);
  });
});
