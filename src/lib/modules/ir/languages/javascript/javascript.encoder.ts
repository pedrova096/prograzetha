import { BinaryOperator, ExpressionKind } from '~/lib/modules/expression';
import type {
  BinaryExpression,
  Expression,
  LogicalExpression,
  MemberExpression,
  UnaryExpression,
} from '~/lib/modules/expression';
import { IRKind } from '../../ir.types';
import type { PatternIR, ProgramIR, StatementIR } from '../../ir.types';
import {
  BINARY_OPERATORS,
  INDENT,
  LOGICAL_OPERATORS,
  PRECEDENCE,
  UNARY_OPERATORS,
} from './javascript.constants';

const createIndent = (level: number) => INDENT.repeat(level);

const getOperator = (expression: BinaryExpression | LogicalExpression) =>
  expression.kind === ExpressionKind.BinaryExpression
    ? BINARY_OPERATORS[expression.operator]
    : LOGICAL_OPERATORS[expression.operator];

const getExpressionPrecedence = (expression: Expression): number => {
  switch (expression.kind) {
    case ExpressionKind.BinaryExpression:
    case ExpressionKind.LogicalExpression:
      return PRECEDENCE[getOperator(expression)];
    case ExpressionKind.UnaryExpression:
      return 8;
    case ExpressionKind.CallExpression:
    case ExpressionKind.MemberExpression:
      return 9;
    case ExpressionKind.ConditionalExpression:
      return 0;
    default:
      return 10;
  }
};

const shouldWrapChildExpression = (
  parent: BinaryExpression | LogicalExpression,
  child: Expression,
  side: 'left' | 'right',
) => {
  if (
    side === 'left' &&
    child.kind === ExpressionKind.UnaryExpression &&
    parent.kind === ExpressionKind.BinaryExpression &&
    parent.operator === BinaryOperator.Power
  ) {
    return true;
  }

  if (
    child.kind !== ExpressionKind.BinaryExpression &&
    child.kind !== ExpressionKind.LogicalExpression
  ) {
    return false;
  }

  const parentOperator = getOperator(parent);
  const childOperator = getOperator(child);
  const parentPrecedence = PRECEDENCE[parentOperator];
  const childPrecedence = PRECEDENCE[childOperator];

  if (childPrecedence < parentPrecedence) return true;
  if (childPrecedence > parentPrecedence) return false;
  if (side === 'left') return parentOperator === '**';
  if (parentOperator === '**') return false;

  return (
    parentOperator !== '*' || childOperator === '/' || childOperator === '%'
  );
};

const getTextFromBinaryChild = (
  parent: BinaryExpression | LogicalExpression,
  child: Expression,
  side: 'left' | 'right',
) => {
  const text = encodeExpression(child);
  return shouldWrapChildExpression(parent, child, side) ? `(${text})` : text;
};

const getTextFromMemberExpression = (expression: MemberExpression) =>
  `${encodeExpression(expression.object)}.${expression.property}`;

const getTextFromUnaryExpression = (expression: UnaryExpression) => {
  const argument = encodeExpression(expression.argument);

  if (
    getExpressionPrecedence(expression.argument) <
    getExpressionPrecedence(expression)
  ) {
    return `${UNARY_OPERATORS[expression.operator]}(${argument})`;
  }

  return `${UNARY_OPERATORS[expression.operator]}${argument}`;
};

const getTemplateTextPart = (part: string | Expression) => {
  if (typeof part !== 'string') {
    return `\${${encodeExpression(part)}}`;
  }

  return part.replace(/[`\\]/g, '\\$&');
};

export const encodeExpression = (expression: Expression): string => {
  switch (expression.kind) {
    case ExpressionKind.Literal:
      return JSON.stringify(expression.value);
    case ExpressionKind.Identifier:
      return expression.name;
    case ExpressionKind.UnaryExpression:
      return getTextFromUnaryExpression(expression);
    case ExpressionKind.BinaryExpression:
    case ExpressionKind.LogicalExpression:
      return `${getTextFromBinaryChild(
        expression,
        expression.left,
        'left',
      )} ${getOperator(expression)} ${getTextFromBinaryChild(
        expression,
        expression.right,
        'right',
      )}`;
    case ExpressionKind.CallExpression:
      return `${encodeExpression(expression.callee)}(${expression.args
        .map(encodeExpression)
        .join(', ')})`;
    case ExpressionKind.MemberExpression:
      return getTextFromMemberExpression(expression);
    case ExpressionKind.ConditionalExpression:
      return `${encodeExpression(expression.test)} ? ${encodeExpression(
        expression.consequent,
      )} : ${encodeExpression(expression.alternate)}`;
    case ExpressionKind.ArrayExpression:
      return `[${expression.elements.map(encodeExpression).join(', ')}]`;
    case ExpressionKind.ObjectExpression:
      return `{ ${expression.properties
        .map(
          (property) =>
            `${JSON.stringify(property.key)}: ${encodeExpression(
              property.value,
            )}`,
        )
        .join(', ')} }`;
    case ExpressionKind.TemplateLiteral:
      return `\`${expression.parts.map(getTemplateTextPart).join('')}\``;
    default:
      return '';
  }
};

const getTextFromPattern = (pattern: PatternIR) => {
  switch (pattern.kind) {
    case IRKind.IdentifierPattern:
      return pattern.name;
  }
};

const getTextFromStatements = (
  statements: StatementIR[],
  indentLevel: number,
): string =>
  statements
    .map((statement) => getTextFromStatement(statement, indentLevel))
    .join('\n');

const getTextFromStatement = (statement: StatementIR, indentLevel: number) => {
  const indent = createIndent(indentLevel);

  switch (statement.kind) {
    case IRKind.VariableDeclaration:
      return statement.init
        ? `${indent}let ${statement.name} = ${encodeExpression(
            statement.init,
          )};`
        : `${indent}let ${statement.name};`;
    case IRKind.Assignment:
      return `${indent}${getTextFromPattern(
        statement.target,
      )} = ${encodeExpression(statement.value)};`;
    case IRKind.ExpressionStatement:
      return `${indent}${encodeExpression(statement.expression)};`;
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

      return `${indent}if (${encodeExpression(
        statement.test,
      )}) {\n${consequent}\n${indent}}${alternate}`;
    }
  }
};

export const encodeProgram = (program: ProgramIR): string =>
  getTextFromStatements(program.body, 0);
