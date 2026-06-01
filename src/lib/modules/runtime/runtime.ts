import type { CoreExpression, Expression } from 'jsep';

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

function evaluateExpression(
  expression: Expression,
  context: RuntimeContext,
): unknown {
  const node = expression as CoreExpression;

  switch (node.type) {
    case 'Literal':
      return node.value;

    case 'Identifier':
      return context.variables[node.name];

    case 'BinaryExpression': {
      const left = evaluateExpression(node.left, context);
      const right = evaluateExpression(node.right, context);

      switch (node.operator) {
        case '&&':
          return Boolean(left) && Boolean(right);
        case '||':
          return Boolean(left) || Boolean(right);
        case '+':
          return Number(left) + Number(right);
        case '-':
          return Number(left) - Number(right);
        case '*':
          return Number(left) * Number(right);
        case '/':
          return Number(left) / Number(right);
        case '>':
          return Number(left) > Number(right);
        case '<':
          return Number(left) < Number(right);
        case '>=':
          return Number(left) >= Number(right);
        case '<=':
          return Number(left) <= Number(right);
        case '==':
          return left == right;
        case '!=':
          return left != right;
        case '===':
          return left === right;
        case '!==':
          return left !== right;
      }
    }

    case 'CallExpression': {
      const callee = node.callee as CoreExpression;

      if (callee.type !== 'MemberExpression') {
        return undefined;
      }

      const property = callee.property as CoreExpression;

      if (property.type !== 'Identifier' || property.name !== 'includes') {
        return undefined;
      }

      const target = evaluateExpression(callee.object, context);
      const [searchExpression] = node.arguments as Expression[];
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
      yield {
        type: RuntimeEvents.ActionAlert,
        nodeId: node.id,
        message: action.message,
      };

      await services.alert(action.message);
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
    type: RuntimeEvents.NodeStart,
    nodeId: node.id,
  };

  if (node.action) {
    yield* executeAction(node, node.action, context, services);
  }

  yield {
    type: RuntimeEvents.NodeEnd,
    nodeId: node.id,
  };
}

async function* executeBranch(
  node: RuntimeBranchNode,
  context: RuntimeContext,
  services: RuntimeServices,
): AsyncGenerator<RuntimeEvent> {
  yield {
    type: RuntimeEvents.NodeStart,
    nodeId: node.id,
  };

  const result = Boolean(evaluateExpression(node.condition, context));

  const branch = result ? 'then' : 'else';

  yield {
    type: RuntimeEvents.BranchChoose,
    nodeId: node.id,
    branch,
  };

  yield {
    type: RuntimeEvents.NodeEnd,
    nodeId: node.id,
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
