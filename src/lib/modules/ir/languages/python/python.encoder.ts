import {
  ExpressionKind,
  type BinaryExpression,
  type Expression,
  type LogicalExpression,
} from '~/lib/modules/expression';

import {
  IRKind,
  type PatternIR,
  type ProgramIR,
  type StatementIR,
} from '../../ir.types';
import {
  BINARY_OPERATORS,
  INDENT,
  LOGICAL_OPERATORS,
  UNARY_OPERATORS,
} from './python.constants';

const createIndent = (level: number) => INDENT.repeat(level);

const getTextFromLiteral = (value: string | number | boolean | null) => {
  if (value === null) return 'None';
  if (typeof value === 'boolean') return value ? 'True' : 'False';

  return JSON.stringify(value);
};

const getOperator = (expression: BinaryExpression | LogicalExpression) =>
  expression.kind === ExpressionKind.BinaryExpression
    ? BINARY_OPERATORS[expression.operator]
    : LOGICAL_OPERATORS[expression.operator];

export const encodeExpression = (expression: Expression): string => {
  switch (expression.kind) {
    case ExpressionKind.Literal:
      return getTextFromLiteral(expression.value);
    case ExpressionKind.Identifier:
      return expression.name;
    case ExpressionKind.UnaryExpression:
      return `${UNARY_OPERATORS[expression.operator]}${encodeExpression(
        expression.argument,
      )}`;
    case ExpressionKind.BinaryExpression:
    case ExpressionKind.LogicalExpression:
      return `(${encodeExpression(expression.left)} ${getOperator(
        expression,
      )} ${encodeExpression(expression.right)})`;
    case ExpressionKind.CallExpression:
      return `${encodeExpression(expression.callee)}(${expression.args
        .map(encodeExpression)
        .join(', ')})`;
    case ExpressionKind.MemberExpression:
      return `${encodeExpression(expression.object)}.${expression.property}`;
    case ExpressionKind.ConditionalExpression:
      return `${encodeExpression(expression.consequent)} if ${encodeExpression(
        expression.test,
      )} else ${encodeExpression(expression.alternate)}`;
    case ExpressionKind.ArrayExpression:
      return `[${expression.elements.map(encodeExpression).join(', ')}]`;
    case ExpressionKind.ObjectExpression:
      return `{${expression.properties
        .map(
          (property) =>
            `${JSON.stringify(property.key)}: ${encodeExpression(
              property.value,
            )}`,
        )
        .join(', ')}}`;
    case ExpressionKind.TemplateLiteral:
      return JSON.stringify(
        expression.parts
          .map((part) =>
            typeof part === 'string' ? part : `{${encodeExpression(part)}}`,
          )
          .join(''),
      );
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
        ? `${indent}${statement.name} = ${encodeExpression(statement.init)}`
        : `${indent}${statement.name} = None`;
    case IRKind.Assignment:
      return `${indent}${getTextFromPattern(
        statement.target,
      )} = ${encodeExpression(statement.value)}`;
    case IRKind.ExpressionStatement:
      return `${indent}${encodeExpression(statement.expression)}`;
    case IRKind.If: {
      const consequent = statement.consequent.length
        ? getTextFromStatements(statement.consequent, indentLevel + 1)
        : `${createIndent(indentLevel + 1)}pass`;
      const alternate = statement.alternate?.length
        ? `\n${indent}else:\n${getTextFromStatements(
            statement.alternate,
            indentLevel + 1,
          )}`
        : '';

      return `${indent}if ${encodeExpression(
        statement.test,
      )}:\n${consequent}${alternate}`;
    }
  }
};

export const encodeProgram = (program: ProgramIR): string =>
  getTextFromStatements(program.body, 0);
