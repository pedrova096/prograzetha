import type { GraphState } from '../graph';
import type { StorageInterface } from './storage.types';
import { deserializeProgram, stringifyProgram } from './storage.serialization';

export const PROGRAM_STORAGE_KEY = 'prograzetha:program';

export const importProgram = async (file: Pick<File, 'text'>) =>
  deserializeProgram(await file.text());

export const downloadProgram = (
  graph: GraphState,
  filename = 'prograzetha-program.json',
) => {
  const blob = new Blob([stringifyProgram(graph)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  globalThis.setTimeout(() => URL.revokeObjectURL(url), 0);
};

const getBrowserStorage = (): StorageInterface => {
  if (!globalThis.localStorage) {
    throw new Error('El almacenamiento local no está disponible.');
  }
  return globalThis.localStorage;
};

export const saveProgramLocally = (
  graph: GraphState,
  storage: StorageInterface = getBrowserStorage(),
) => {
  storage.setItem(PROGRAM_STORAGE_KEY, stringifyProgram(graph));
};

export const loadLocalProgram = (
  storage: StorageInterface = getBrowserStorage(),
): GraphState | null => {
  const source = storage.getItem(PROGRAM_STORAGE_KEY);
  return source === null ? null : deserializeProgram(source);
};

export const clearLocalProgram = (
  storage: StorageInterface = getBrowserStorage(),
) => storage.removeItem(PROGRAM_STORAGE_KEY);
