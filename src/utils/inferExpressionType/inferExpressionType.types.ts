export enum InferredType {
  Unknown = 'unknown',
  Null = 'null',
  Boolean = 'boolean',
  Number = 'number',
  String = 'string',
  Array = 'array',
  Object = 'object',
}

export type TypeScope = Record<string, `${InferredType}`>;
