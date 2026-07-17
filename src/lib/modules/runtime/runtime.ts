import { RuntimeActions, RuntimeEvents, RuntimeNodes } from './runtime.types';
import type {
  RuntimeContext,
  RuntimeAction,
  RuntimeBranchNode,
  RuntimeEvent,
  RuntimeNode,
  RuntimeServices,
  RuntimeStepNode,
} from './runtime.types';
import {
  BinaryOperator,
  ExpressionKind,
  LogicalOperatorExpression,
  UnaryOperator,
  type Expression,
} from '../expression';

function evaluateExpression(
  expression: Expression,
  context: RuntimeContext,
): unknown {
  switch (expression.kind) {
    case ExpressionKind.Literal:
      return expression.value;

    case ExpressionKind.Identifier:
      return context.variables[expression.name];

    case ExpressionKind.UnaryExpression: {
      const argument = evaluateExpression(expression.argument, context);

      switch (expression.operator) {
        case UnaryOperator.Not:
          return !argument;
        case UnaryOperator.Negative:
          return -Number(argument);
        case UnaryOperator.Positive:
          return Number(argument);
      }

      return undefined;
    }

    case ExpressionKind.BinaryExpression: {
      const left = evaluateExpression(expression.left, context);
      const right = evaluateExpression(expression.right, context);

      switch (expression.operator) {
        case BinaryOperator.Add:
          if (typeof left === 'string' || typeof right === 'string') {
            return String(left) + String(right);
          }

          return Number(left) + Number(right);
        case BinaryOperator.Subtract:
          return Number(left) - Number(right);
        case BinaryOperator.Multiply:
          return Number(left) * Number(right);
        case BinaryOperator.Divide:
          return Number(left) / Number(right);
        case BinaryOperator.Modulo:
          return Number(left) % Number(right);
        case BinaryOperator.Power:
          return Number(left) ** Number(right);
        case BinaryOperator.GreaterThan:
          return Number(left) > Number(right);
        case BinaryOperator.LessThan:
          return Number(left) < Number(right);
        case BinaryOperator.GreaterThanOrEqual:
          return Number(left) >= Number(right);
        case BinaryOperator.LessThanOrEqual:
          return Number(left) <= Number(right);
        case BinaryOperator.Equals:
          return left == right;
        case BinaryOperator.NotEquals:
          return left != right;
      }

      return undefined;
    }

    case ExpressionKind.LogicalExpression: {
      if (expression.operator === LogicalOperatorExpression.And) {
        return (
          Boolean(evaluateExpression(expression.left, context)) &&
          Boolean(evaluateExpression(expression.right, context))
        );
      }

      if (expression.operator === LogicalOperatorExpression.Or) {
        return (
          Boolean(evaluateExpression(expression.left, context)) ||
          Boolean(evaluateExpression(expression.right, context))
        );
      }

      return undefined;
    }

    case ExpressionKind.CallExpression: {
      const callee = expression.callee;

      if (callee.kind !== ExpressionKind.MemberExpression) {
        return undefined;
      }

      if (callee.property !== 'includes') {
        return undefined;
      }

      const target = evaluateExpression(callee.object, context);
      const [searchExpression] = expression.args;
      const search = searchExpression
        ? evaluateExpression(searchExpression, context)
        : undefined;

      if (typeof target === 'string') {
        return target.includes(String(search));
      }

      if (Array.isArray(target)) {
        return target.includes(search);
      }

      return false;
    }

    case ExpressionKind.MemberExpression: {
      const object = evaluateExpression(expression.object, context);

      if (object && typeof object === 'object') {
        return (object as Record<string, unknown>)[expression.property];
      }

      return undefined;
    }

    case ExpressionKind.ConditionalExpression:
      return evaluateExpression(
        evaluateExpression(expression.test, context)
          ? expression.consequent
          : expression.alternate,
        context,
      );

    case ExpressionKind.ArrayExpression:
      return expression.elements.map((element) =>
        evaluateExpression(element, context),
      );

    case ExpressionKind.ObjectExpression:
      return Object.fromEntries(
        expression.properties.map((property) => [
          property.key,
          evaluateExpression(property.value, context),
        ]),
      );

    case ExpressionKind.TemplateLiteral:
      return expression.parts
        .map((part) =>
          typeof part === 'string' ? part : evaluateExpression(part, context),
        )
        .join('');
  }
}

async function* executeAction(
  node: RuntimeStepNode,
  action: RuntimeAction,
  context: RuntimeContext,
  services: RuntimeServices,
): AsyncGenerator<RuntimeEvent> {
  switch (action.type) {
    case RuntimeActions.Noop:
      return;

    case RuntimeActions.Alert: {
      const message = action.expression
        ? String(evaluateExpression(action.expression, context))
        : action.message;

      yield {
        type: RuntimeEvents.ActionAlert,
        nodeId: node.id,
        message,
      };

      await services.output(message);
      return;
    }

    case RuntimeActions.Input: {
      yield {
        type: RuntimeEvents.ActionInput,
        nodeId: node.id,
        variable: action.variable,
        prompt: action.prompt,
      };

      const value = await services.input(action.prompt);

      context.variables[action.variable] = value;

      yield {
        type: RuntimeEvents.ContextUpdate,
        variables: { ...context.variables },
      };

      return;
    }

    case RuntimeActions.Assign: {
      const value = evaluateExpression(action.expression, context);

      context.variables[action.variable] = value;

      yield {
        type: RuntimeEvents.ContextUpdate,
        variables: { ...context.variables },
      };

      return;
    }
  }
}

async function* executeStep(
  node: RuntimeStepNode,
  context: RuntimeContext,
  services: RuntimeServices,
): AsyncGenerator<RuntimeEvent> {
  yield {
    type: RuntimeEvents.NodeProcess,
    nodeId: node.id,
  };

  if (node.action) {
    yield* executeAction(node, node.action, context, services);
  }
}

async function* executeBranch(
  node: RuntimeBranchNode,
  context: RuntimeContext,
  services: RuntimeServices,
): AsyncGenerator<RuntimeEvent> {
  yield {
    type: RuntimeEvents.NodeProcess,
    nodeId: node.id,
  };

  const result = Boolean(evaluateExpression(node.condition, context));

  const branch = result ? 'then' : 'else';

  yield {
    type: RuntimeEvents.BranchChoose,
    nodeId: node.id,
    branch,
  };

  const selectedNodes = result ? node.then : node.else;

  if (selectedNodes.length > 0) {
    yield {
      type: RuntimeEvents.EdgeTraverse,
      from: node.id,
      to: selectedNodes[0].id,
    };

    yield* executeSequence(selectedNodes, context, services);
  }
}

async function* executeNode(
  node: RuntimeNode,
  context: RuntimeContext,
  services: RuntimeServices,
): AsyncGenerator<RuntimeEvent> {
  if (node.type === RuntimeNodes.Branch) {
    yield* executeBranch(node, context, services);
    return;
  }

  yield* executeStep(node, context, services);
}

async function* executeSequence(
  program: RuntimeNode[],
  context: RuntimeContext,
  services: RuntimeServices,
): AsyncGenerator<RuntimeEvent> {
  for (let i = 0; i < program.length; i++) {
    const current = program[i];

    yield* executeNode(current, context, services);

    const next = program[i + 1];

    if (next) {
      yield {
        type: RuntimeEvents.EdgeTraverse,
        from: current.id,
        to: next.id,
      };
    }
  }
}

export async function* executeProgram(
  program: RuntimeNode[],
  context: RuntimeContext,
  services: RuntimeServices,
): AsyncGenerator<RuntimeEvent> {
  yield* executeSequence(program, context, services);
  yield { type: RuntimeEvents.ExecutionEnd };
}

export function isEdgeTraverse(event: RuntimeEvent): event is {
  type: RuntimeEvents.EdgeTraverse;
  from: string;
  to: string;
} {
  return event.type === RuntimeEvents.EdgeTraverse;
}
