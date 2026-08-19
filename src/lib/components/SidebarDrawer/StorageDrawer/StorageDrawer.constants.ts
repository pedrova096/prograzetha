import { OperationKind, type OperationUnion } from './OperationState';

export const DEFAULT_ERROR_MESSAGE = 'Ocurrió un error inesperado.';

export const SUCCESS_IMPORT: OperationUnion = {
  kind: OperationKind.Success,
  message: 'El programa se importó correctamente.',
};

export const SUCCESS_EXPORT: OperationUnion = {
  kind: OperationKind.Success,
  message: 'La descarga del programa comenzó correctamente.',
};
