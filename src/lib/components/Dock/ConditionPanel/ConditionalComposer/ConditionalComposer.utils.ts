import { isConditionGroup, type ConditionUnion } from '~/lib/modules/nodes';
import { path, transformSelectorToPath, updatePath } from '~/utils/fp';
import type { MoveConditionOptions } from './ConditionalComposer.types';

export const addConditionChild = (
  value: ConditionUnion,
  selector: string,
  child: ConditionUnion,
): ConditionUnion => {
  const selectorPath = transformSelectorToPath(selector);

  const condition = path<ConditionUnion>(selectorPath, value);

  if (!condition || !isConditionGroup(condition)) return value;

  return updatePath<ConditionUnion[], ConditionUnion>(
    [...selectorPath, 'children'],
    [...condition.children, child],
    value,
  );
};

export const removeCondition = (
  value: ConditionUnion,
  selector: string,
): ConditionUnion => {
  const selectorPath = transformSelectorToPath(selector);

  const condition = path<ConditionUnion>(selectorPath, value);
  if (!condition) return value;

  const childrenPath = selectorPath.slice(0, -1);
  const childrenConditions = path<ConditionUnion[]>(childrenPath, value);

  if (!childrenConditions || !Array.isArray(childrenConditions)) return value;

  return updatePath<ConditionUnion[], ConditionUnion>(
    childrenPath,
    childrenConditions.filter((child) => child.id !== condition.id),
    value,
  );
};

export const updateCondition = (
  value: ConditionUnion,
  selector: string,
  child: ConditionUnion,
): ConditionUnion => {
  const selectorPath = transformSelectorToPath(selector);

  const condition = path<ConditionUnion>(selectorPath, value);
  if (!condition) return value;

  return updatePath(selectorPath, child, value);
};

export const moveCondition = (
  value: ConditionUnion,
  options: MoveConditionOptions,
) => {
  const newValue = structuredClone(value);
  const fromPath = transformSelectorToPath(options.fromPath);
  const toPath = transformSelectorToPath(options.toPath);

  const fromCondition = path<ConditionUnion>(fromPath, newValue);
  const toCondition = path<ConditionUnion>(toPath, newValue);

  if (!fromCondition || !isConditionGroup(fromCondition)) return value;
  if (!toCondition || !isConditionGroup(toCondition)) return value;

  const item = fromCondition.children[options.oldIndex];
  if (!item) return value;

  fromCondition.children.splice(options.oldIndex, 1);
  // const updatedFromChildren = fromCondition.children
  //   .slice(0, options.oldIndex)
  //   .concat(fromCondition.children.slice(options.oldIndex + 1));

  const adjustedIndex =
    fromCondition === toCondition && options.oldIndex < options.newIndex
      ? options.newIndex
      : options.newIndex;

  toCondition.children.splice(adjustedIndex, 0, item);

  return newValue;
};
