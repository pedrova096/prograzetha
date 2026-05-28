export const transformSelectorToPath = (value: string) => {
  if (!value) return [];

  const normalizedPath = value.replace(/\[(\w+)\]/g, '.$1');

  return normalizedPath.split('.');
};
