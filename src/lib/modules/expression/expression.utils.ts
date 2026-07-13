import {
  BinaryOperator,
  ExpressionKind,
  type Expression,
} from './expression.types';

export const createIdentifierExpression = (name: string): Expression => ({
  kind: ExpressionKind.Identifier,
  name,
});

export const createLiteralExpression = (
  value: string | number | boolean | null,
): Expression => ({
  kind: ExpressionKind.Literal,
  value,
});

export const createInterpolatedTextExpression = (text: string): Expression => {
  const parts: Expression[] = [];
  const variableRegex = /\$([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = variableRegex.exec(text)) !== null) {
    const beforeText = text.slice(lastIndex, match.index);

    if (beforeText) {
      parts.push(createLiteralExpression(beforeText));
    }

    parts.push(createIdentifierExpression(match[1]));
    lastIndex = match.index + match[0].length;
  }

  const tailText = text.slice(lastIndex);

  if (tailText) {
    parts.push(createLiteralExpression(tailText));
  }

  if (!parts.length) {
    return createLiteralExpression(text);
  }

  const [firstPart, ...restParts] = parts;

  return restParts.reduce<Expression>(
    (expression, part) => ({
      kind: ExpressionKind.BinaryExpression,
      operator: BinaryOperator.Add,
      left: expression,
      right: part,
    }),
    firstPart,
  );
};
