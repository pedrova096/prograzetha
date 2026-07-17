import {
  BinaryOperator,
  ExpressionKind,
  LogicalOperatorExpression,
  type Expression,
} from '~/lib/modules/expression';

import {
  ConditionOperator,
  isConditionGroup,
  LogicalOperator,
  type ConditionNode,
  type ConditionUnion,
} from '../nodes';
import { parseExpression } from '../expression';

export const createIdentifier = (name: string): Expression => ({
  kind: ExpressionKind.Identifier,
  name,
});

export const createLiteral = (
  value: string | number | boolean | null,
): Expression => ({
  kind: ExpressionKind.Literal,
  value,
});

export const createCallExpression = (
  callee: string,
  args: Expression[] = [],
): Expression => ({
  kind: ExpressionKind.CallExpression,
  callee: createIdentifier(callee),
  args,
});

const CONDITION_OPERATORS: Record<ConditionOperator, BinaryOperator> = {
  [ConditionOperator.Equals]: BinaryOperator.Equals,
  [ConditionOperator.NotEquals]: BinaryOperator.NotEquals,
  [ConditionOperator.GreaterThan]: BinaryOperator.GreaterThan,
  [ConditionOperator.GreaterThanOrEqual]: BinaryOperator.GreaterThanOrEqual,
  [ConditionOperator.LessThan]: BinaryOperator.LessThan,
  [ConditionOperator.LessThanOrEqual]: BinaryOperator.LessThanOrEqual,
  [ConditionOperator.Includes]: BinaryOperator.Equals,
};

const LOGICAL_OPERATORS: Record<LogicalOperator, LogicalOperatorExpression> = {
  [LogicalOperator.And]: LogicalOperatorExpression.And,
  [LogicalOperator.Or]: LogicalOperatorExpression.Or,
};

const createConditionNodeExpression = (
  condition: ConditionNode,
): Expression => {
  const left = parseExpression(condition.leftSide);
  const right = parseExpression(condition.rightSide);

  if (condition.operator === ConditionOperator.Includes) {
    return {
      kind: ExpressionKind.CallExpression,
      callee: {
        kind: ExpressionKind.MemberExpression,
        object: left,
        property: 'includes',
      },
      args: [right],
    };
  }

  return {
    kind: ExpressionKind.BinaryExpression,
    operator: CONDITION_OPERATORS[condition.operator],
    left,
    right,
  };
};

export const createConditionExpression = (
  condition: ConditionUnion,
): Expression => {
  if (!isConditionGroup(condition)) {
    return createConditionNodeExpression(condition);
  }

  const [first, ...rest] = condition.children.map(createConditionExpression);

  if (!first) {
    return createLiteral(true);
  }

  return rest.reduce<Expression>((expression, child) => {
    return {
      kind: ExpressionKind.LogicalExpression,
      operator: LOGICAL_OPERATORS[condition.logicalOperator],
      left: expression,
      right: child,
    };
  }, first);
};
