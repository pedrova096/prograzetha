import { ExpressionKind, type Expression } from '~/lib/modules/expression';

const ALLOWED_GLOBAL_IDENTIFIERS = new Set(['Math']);

const collectExpressionVariablesInner = (
  node: Expression | null | undefined,
  variables = new Set<string>(),
) => {
  if (!node) {
    return variables;
  }

  switch (node.kind) {
    case ExpressionKind.Identifier:
      if (!ALLOWED_GLOBAL_IDENTIFIERS.has(node.name)) {
        variables.add(node.name);
      }

      break;

    case ExpressionKind.ArrayExpression:
      node.elements.forEach((element) => {
        collectExpressionVariablesInner(element, variables);
      });
      break;

    case ExpressionKind.BinaryExpression:
    case ExpressionKind.LogicalExpression:
      collectExpressionVariablesInner(node.left, variables);
      collectExpressionVariablesInner(node.right, variables);
      break;

    case ExpressionKind.CallExpression:
      collectExpressionVariablesInner(node.callee, variables);
      node.args.forEach((argument) => {
        collectExpressionVariablesInner(argument, variables);
      });
      break;

    case ExpressionKind.ConditionalExpression:
      collectExpressionVariablesInner(node.test, variables);
      collectExpressionVariablesInner(node.consequent, variables);
      collectExpressionVariablesInner(node.alternate, variables);
      break;

    case ExpressionKind.MemberExpression:
      collectExpressionVariablesInner(node.object, variables);
      break;

    case ExpressionKind.ObjectExpression:
      node.properties.forEach((property) => {
        collectExpressionVariablesInner(property.value, variables);
      });
      break;

    case ExpressionKind.TemplateLiteral:
      node.parts.forEach((part) => {
        if (typeof part !== 'string') {
          collectExpressionVariablesInner(part, variables);
        }
      });
      break;

    case ExpressionKind.UnaryExpression:
      collectExpressionVariablesInner(node.argument, variables);
      break;
  }

  return variables;
};

export const collectExpressionVariables = (
  node: Expression | null | undefined,
) => {
  const variables = collectExpressionVariablesInner(node);
  return Array.from(variables);
};
