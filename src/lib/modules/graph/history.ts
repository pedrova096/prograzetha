export type SnapshotHistory<T> = {
  past: T[];
  future: T[];
};

export type SnapshotHistoryResult<T> = {
  value: T;
  history: SnapshotHistory<T>;
};

export const createSnapshotHistory = <T>(): SnapshotHistory<T> => ({
  past: [],
  future: [],
});

export const recordSnapshot = <T>(
  history: SnapshotHistory<T>,
  current: T,
): SnapshotHistory<T> => ({
  past: [...history.past, current],
  future: [],
});

export const undoSnapshot = <T>(
  history: SnapshotHistory<T>,
  current: T,
): SnapshotHistoryResult<T> | null => {
  const value = history.past.at(-1);
  if (value === undefined) return null;

  return {
    value,
    history: {
      past: history.past.slice(0, -1),
      future: [current, ...history.future],
    },
  };
};

export const redoSnapshot = <T>(
  history: SnapshotHistory<T>,
  current: T,
): SnapshotHistoryResult<T> | null => {
  const [value, ...future] = history.future;
  if (value === undefined) return null;

  return {
    value,
    history: {
      past: [...history.past, current],
      future,
    },
  };
};
