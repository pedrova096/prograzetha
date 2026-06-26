export type DebouncedFunction<Arguments extends unknown[]> = ((
  ...args: Arguments
) => void) & {
  cancel: () => void;
  flush: () => void;
};

export const debounce = <Arguments extends unknown[]>(
  callback: (...args: Arguments) => void,
  delay: number,
): DebouncedFunction<Arguments> => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Arguments | null = null;

  const cancel = () => {
    if (timeout !== null) clearTimeout(timeout);

    timeout = null;
    lastArgs = null;
  };

  const flush = () => {
    if (timeout === null || lastArgs === null) return;

    clearTimeout(timeout);
    timeout = null;

    callback(...lastArgs);
    lastArgs = null;
  };

  const debounced = ((...args: Arguments) => {
    if (timeout !== null) clearTimeout(timeout);

    lastArgs = args;
    timeout = setTimeout(() => {
      timeout = null;

      if (lastArgs === null) return;

      callback(...lastArgs);
      lastArgs = null;
    }, delay);
  }) as DebouncedFunction<Arguments>;

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced;
};
