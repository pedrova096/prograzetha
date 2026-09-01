import { HardDrive } from '@lucide/svelte';
import { OperationKind, type OperationUnion } from './OperationState';

export const STORAGE_ICON_LABEL = {
  icon: HardDrive,
  label: 'Almacenamiento',
};

export const DEFAULT_ERROR_MESSAGE = 'Ocurrió un error inesperado.';

export const SUCCESS_IMPORT: OperationUnion = {
  kind: OperationKind.Success,
  message: 'El programa se importó correctamente.',
};

export const SUCCESS_EXPORT: OperationUnion = {
  kind: OperationKind.Success,
  message: 'La descarga del programa comenzó correctamente.',
};
