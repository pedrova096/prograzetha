export function indexBy<TItem, TKey extends PropertyKey>(
  getKey: (item: TItem) => TKey,
): (items: readonly TItem[]) => Record<TKey, TItem>;
export function indexBy<TItem, TKey extends PropertyKey>(
  getKey: (item: TItem) => TKey,
  items: readonly TItem[],
): Record<TKey, TItem>;
export function indexBy<TItem, TKey extends PropertyKey>(
  getKey: (item: TItem) => TKey,
  items?: readonly TItem[],
) {
  const createIndex = (nextItems: readonly TItem[]) => {
    return nextItems.reduce(
      (index, item) => {
        index[getKey(item)] = item;
        return index;
      },
      {} as Record<TKey, TItem>,
    );
  };

  if (arguments.length === 1) {
    return createIndex;
  }

  return createIndex(items!);
}
