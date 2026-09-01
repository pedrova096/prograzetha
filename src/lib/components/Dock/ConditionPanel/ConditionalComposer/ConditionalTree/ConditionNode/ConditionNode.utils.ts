import { LiteralVariants } from '~/lib/constants';

import { InputKind } from './ConditionNode.types';

export const STRING_LITERAL_REGEX = /^"([^"\\]|\\.)*"$|^'([^'\\]|\\.)*'$/;
export const NUMBER_LITERAL_REGEX = /^-?\d+(\.\d+)?$/;
export const BOOLEAN_LITERAL_REGEX = /^(true|false)$/i;
export const NULL_LITERAL_REGEX = /^null$/i;

export const VARIABLE_REGEX =
  /^[a-zA-Z_$][a-zA-Z0-9_$]*(\.[a-zA-Z_$][a-zA-Z0-9_$]*)*$/;

type InputClassification =
  | { kind: InputKind.Literal; variant: LiteralVariants }
  | { kind: InputKind };

export const isLiteralKind = (
  value: InputClassification | null,
): value is { kind: InputKind.Literal; variant: LiteralVariants } =>
  value?.kind === InputKind.Literal;

export const classifyInput = (input?: string): InputClassification | null => {
  const value = input?.trim();

  if (!value) {
    return null;
  }

  if (STRING_LITERAL_REGEX.test(value)) {
    return { kind: InputKind.Literal, variant: LiteralVariants.String };
  }

  if (NUMBER_LITERAL_REGEX.test(value)) {
    return { kind: InputKind.Literal, variant: LiteralVariants.Number };
  }

  if (BOOLEAN_LITERAL_REGEX.test(value)) {
    return { kind: InputKind.Literal, variant: LiteralVariants.Boolean };
  }

  if (NULL_LITERAL_REGEX.test(value)) {
    return { kind: InputKind.Literal, variant: LiteralVariants.Null };
  }

  if (VARIABLE_REGEX.test(value)) {
    return { kind: InputKind.Variable };
  }

  return { kind: InputKind.Invalid };
};
