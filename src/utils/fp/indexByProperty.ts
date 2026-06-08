type IndexableProperty<TItem> = {
  [TKey in keyof TItem]: TItem[TKey] extends PropertyKey ? TKey : never;
}[keyof TItem];

type IndexKey<TItem, TKey extends IndexableProperty<TItem>> = Extract<
  TItem[TKey],
  PropertyKey
>;

export function indexByProperty<TItem, TKey extends IndexableProperty<TItem>>(
  key: TKey,
): (items: readonly TItem[]) => Record<IndexKey<TItem, TKey>, TItem>;
export function indexByProperty<TItem, TKey extends IndexableProperty<TItem>>(
  key: TKey,
  items: readonly TItem[],
): Record<IndexKey<TItem, TKey>, TItem>;
export function indexByProperty<TItem, TKey extends IndexableProperty<TItem>>(
  key: TKey,
  items?: readonly TItem[],
) {
  const createIndex = (nextItems: readonly TItem[]) => {
    return nextItems.reduce(
      (index, item) => {
        index[item[key] as IndexKey<TItem, TKey>] = item;
        return index;
      },
      {} as Record<IndexKey<TItem, TKey>, TItem>,
    );
  };

  if (arguments.length === 1) {
    return createIndex;
  }

  return createIndex(items!);
}
