import type jsep from 'jsep';

const ALLOWED_GLOBAL_IDENTIFIERS = new Set(['Math']);

const collectExpressionVariablesInner = (
  node: jsep.Expression | null | undefined,
  variables = new Set<string>(),
) => {
  if (!node) {
    return variables;
  }

  switch (node.type) {
    case 'Identifier': {
      const name = (node as jsep.Identifier).name;

      if (!ALLOWED_GLOBAL_IDENTIFIERS.has(name)) {
        variables.add(name);
      }

      break;
    }

    case 'ArrayExpression':
      (node as jsep.ArrayExpression).elements.forEach((element) => {
        collectExpressionVariablesInner(element, variables);
      });
      break;

    case 'BinaryExpression': {
      const expression = node as jsep.BinaryExpression;
      collectExpressionVariablesInner(expression.left, variables);
      collectExpressionVariablesInner(expression.right, variables);
      break;
    }

    case 'CallExpression': {
      const expression = node as jsep.CallExpression;
      collectExpressionVariablesInner(expression.callee, variables);
      expression.arguments.forEach((argument) => {
        collectExpressionVariablesInner(argument, variables);
      });
      break;
    }

    case 'ConditionalExpression': {
      const expression = node as jsep.ConditionalExpression;
      collectExpressionVariablesInner(expression.test, variables);
      collectExpressionVariablesInner(expression.consequent, variables);
      collectExpressionVariablesInner(expression.alternate, variables);
      break;
    }

    case 'MemberExpression': {
      const expression = node as jsep.MemberExpression;
      collectExpressionVariablesInner(expression.object, variables);

      if (expression.computed) {
        collectExpressionVariablesInner(expression.property, variables);
      }

      break;
    }

    case 'SequenceExpression':
      (node as jsep.SequenceExpression).expressions.forEach((expression) => {
        collectExpressionVariablesInner(expression, variables);
      });
      break;

    case 'UnaryExpression':
      collectExpressionVariablesInner(
        (node as jsep.UnaryExpression).argument,
        variables,
      );
      break;
  }

  return variables;
};

export const collectExpressionVariables = (
  node: jsep.Expression | null | undefined,
) => {
  const variables = collectExpressionVariablesInner(node);
  return Array.from(variables);
};
