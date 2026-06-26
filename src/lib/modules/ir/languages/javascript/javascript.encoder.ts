import { BinaryOperatorIR, IRKind } from '../../ir.types';
import type {
  BinaryExpressionIR,
  ConditionalExpressionIR,
  ExpressionIR,
  LogicalExpressionIR,
  PatternIR,
  ProgramIR,
  StatementIR,
  UnaryExpressionIR,
} from '../../ir.types';
import {
  BINARY_OPERATORS,
  LOGICAL_OPERATORS,
  PRECEDENCE,
  UNARY_OPERATORS,
} from './javascript.constants';

const INDENT = '  ';

const createIndent = (level: number) => INDENT.repeat(level);

const getTextFromPattern = (pattern: PatternIR): string => {
  switch (pattern.kind) {
    case IRKind.IdentifierPattern:
      return pattern.name;

    default:
      return '';
  }
};

const getOperator = (
  expression: BinaryExpressionIR | LogicalExpressionIR,
): string => {
  return expression.kind === IRKind.BinaryExpression
    ? BINARY_OPERATORS[expression.operator]
    : LOGICAL_OPERATORS[expression.operator];
};

const getExpressionPrecedence = (expression: ExpressionIR): number => {
  switch (expression.kind) {
    case IRKind.BinaryExpression:
    case IRKind.LogicalExpression:
      return PRECEDENCE[getOperator(expression)];

    case IRKind.UnaryExpression:
      return 8;

    case IRKind.CallExpression:
    case IRKind.MemberExpression:
      return 9;

    case IRKind.ConditionalExpression:
      return 0;

    case IRKind.ArrayExpression:
    case IRKind.ObjectExpression:
    case IRKind.TemplateLiteral:
    case IRKind.Literal:
    case IRKind.Identifier:
      return 10;

    default:
      return 0;
  }
};

const shouldWrapChildExpression = (
  parent: BinaryExpressionIR | LogicalExpressionIR,
  child: ExpressionIR,
  side: 'left' | 'right',
): boolean => {
  if (
    side === 'left' &&
    child.kind === IRKind.UnaryExpression &&
    parent.kind === IRKind.BinaryExpression &&
    parent.operator === BinaryOperatorIR.Power
  ) {
    return true;
  }

  if (
    child.kind !== IRKind.BinaryExpression &&
    child.kind !== IRKind.LogicalExpression
  ) {
    return false;
  }

  const parentOperator = getOperator(parent);
  const childOperator = getOperator(child);
  const parentPrecedence = PRECEDENCE[parentOperator];
  const childPrecedence = PRECEDENCE[childOperator];

  if (childPrecedence < parentPrecedence) {
    return true;
  }

  if (childPrecedence > parentPrecedence) {
    return false;
  }

  if (side === 'left') {
    return parentOperator === '**';
  }

  if (parentOperator === '**') {
    return false;
  }

  return (
    parentOperator !== '*' || childOperator === '/' || childOperator === '%'
  );
};

const getTextFromBinaryChild = (
  parent: BinaryExpressionIR | LogicalExpressionIR,
  child: ExpressionIR,
  side: 'left' | 'right',
): string => {
  const text = getTextFromExpression(child);

  return shouldWrapChildExpression(parent, child, side) ? `(${text})` : text;
};

const getTextFromCallExpression = (expression: ExpressionIR): string => {
  if (expression.kind !== IRKind.CallExpression) {
    return getTextFromExpression(expression);
  }

  if (
    expression.callee.kind === IRKind.Identifier &&
    expression.callee.name === 'input'
  ) {
    const promptText = expression.args[0]
      ? getTextFromExpression(expression.args[0])
      : "''";

    return `prompt(${promptText})`;
  }

  if (
    expression.callee.kind === IRKind.Identifier &&
    expression.callee.name === 'output'
  ) {
    return `console.log(${expression.args.map(getTextFromExpression).join(', ')})`;
  }

  return `${getTextFromExpression(expression.callee)}(${expression.args
    .map(getTextFromExpression)
    .join(', ')})`;
};

const getTextFromBinaryExpression = (
  expression: BinaryExpressionIR | LogicalExpressionIR,
): string => {
  const operator = getOperator(expression);
  const left = getTextFromBinaryChild(expression, expression.left, 'left');
  const right = getTextFromBinaryChild(expression, expression.right, 'right');

  return `${left} ${operator} ${right}`;
};

const getTextFromUnaryExpression = (expression: UnaryExpressionIR): string => {
  const argument = getTextFromExpression(expression.argument);

  if (
    getExpressionPrecedence(expression.argument) <
    getExpressionPrecedence(expression)
  ) {
    return `${UNARY_OPERATORS[expression.operator]}(${argument})`;
  }

  return `${UNARY_OPERATORS[expression.operator]}${argument}`;
};

const getTextFromConditionalExpression = (
  expression: ConditionalExpressionIR,
): string => {
  const testExpression = getTextFromExpression(expression.test);
  const consequentExpression = getTextFromExpression(expression.consequent);
  const alternateExpression = getTextFromExpression(expression.alternate);

  return `${testExpression} ? ${consequentExpression} : ${alternateExpression}`;
};

const getTemplateTextPart = (part: string | ExpressionIR): string => {
  if (typeof part !== 'string') {
    return `\${${getTextFromExpression(part)}}`;
  }

  return part.replace(/[`\\]/g, '\\$&');
};

const getTextFromExpression = (expression: ExpressionIR): string => {
  switch (expression.kind) {
    case IRKind.Literal:
      return JSON.stringify(expression.value);

    case IRKind.Identifier:
      return expression.name;

    case IRKind.UnaryExpression:
      return getTextFromUnaryExpression(expression);

    case IRKind.BinaryExpression:
    case IRKind.LogicalExpression:
      return getTextFromBinaryExpression(expression);

    case IRKind.CallExpression:
      return getTextFromCallExpression(expression);

    case IRKind.MemberExpression:
      return `${getTextFromExpression(expression.object)}.${expression.property}`;

    case IRKind.ConditionalExpression:
      return getTextFromConditionalExpression(expression);

    case IRKind.ArrayExpression:
      return `[${expression.elements.map(getTextFromExpression).join(', ')}]`;

    case IRKind.ObjectExpression:
      return `{ ${expression.properties
        .map(
          (property) =>
            `${JSON.stringify(property.key)}: ${getTextFromExpression(
              property.value,
            )}`,
        )
        .join(', ')} }`;

    case IRKind.TemplateLiteral:
      return `\`${expression.parts.map(getTemplateTextPart).join('')}\``;

    default:
      return '';
  }
};

const getTextFromStatement = (
  statement: StatementIR,
  indentLevel: number,
): string => {
  const indent = createIndent(indentLevel);

  switch (statement.kind) {
    case IRKind.VariableDeclaration:
      return statement.init
        ? `${indent}let ${statement.name} = ${getTextFromExpression(
            statement.init,
          )};`
        : `${indent}let ${statement.name};`;

    case IRKind.Assignment:
      return `${indent}${getTextFromPattern(
        statement.target,
      )} = ${getTextFromExpression(statement.value)};`;

    case IRKind.ExpressionStatement:
      return `${indent}${getTextFromExpression(statement.expression)};`;

    case IRKind.If: {
      const consequent = getTextFromStatements(
        statement.consequent,
        indentLevel + 1,
      );
      const alternate = statement.alternate?.length
        ? ` else {\n${getTextFromStatements(
            statement.alternate,
            indentLevel + 1,
          )}\n${indent}}`
        : '';

      return `${indent}if (${getTextFromExpression(
        statement.test,
      )}) {\n${consequent}\n${indent}}${alternate}`;
    }

    default:
      return '';
  }
};

const getTextFromStatements = (
  statements: StatementIR[],
  indentLevel: number,
): string =>
  statements
    .map((statement) => getTextFromStatement(statement, indentLevel))
    .join('\n');

export const encodeProgram = (program: ProgramIR): string => {
  return getTextFromStatements(program.body, 0);
};
