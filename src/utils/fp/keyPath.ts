import { path } from './path';
import { transformSelectorToPath } from './transformSelectorToPath';

export const keyPath = <T = unknown, R extends object = object>(
  selector: string,
  target: R,
) => {
  return path<T>(transformSelectorToPath(selector), target);
};
