import {
  BinaryOperatorIR,
  IRKind,
  LogicalOperatorIR,
  UnaryOperatorIR,
  type BinaryExpressionIR,
  type ExpressionIR,
  type LogicalExpressionIR,
  type PatternIR,
  type ProgramIR,
  type StatementIR,
  type UnaryExpressionIR,
} from '../ir.types';

const INDENT = '    ';

const BINARY_OPERATORS = {
  [BinaryOperatorIR.Equals]: '==',
  [BinaryOperatorIR.NotEquals]: '!=',
  [BinaryOperatorIR.GreaterThan]: '>',
  [BinaryOperatorIR.GreaterThanOrEqual]: '>=',
  [BinaryOperatorIR.LessThan]: '<',
  [BinaryOperatorIR.LessThanOrEqual]: '<=',
  [BinaryOperatorIR.Add]: '+',
  [BinaryOperatorIR.Subtract]: '-',
  [BinaryOperatorIR.Multiply]: '*',
  [BinaryOperatorIR.Divide]: '/',
  [BinaryOperatorIR.Modulo]: '%',
  [BinaryOperatorIR.Power]: '**',
} as const satisfies Record<BinaryOperatorIR, string>;

const LOGICAL_OPERATORS = {
  [LogicalOperatorIR.And]: 'and',
  [LogicalOperatorIR.Or]: 'or',
} as const satisfies Record<LogicalOperatorIR, string>;

const UNARY_OPERATORS = {
  [UnaryOperatorIR.Not]: 'not ',
  [UnaryOperatorIR.Negative]: '-',
  [UnaryOperatorIR.Positive]: '+',
} as const satisfies Record<UnaryOperatorIR, string>;

const createIndent = (level: number) => INDENT.repeat(level);

const getTextFromPattern = (pattern: PatternIR): string => {
  switch (pattern.kind) {
    case IRKind.IdentifierPattern:
      return pattern.name;

    default:
      return '';
  }
};

const getTextFromLiteral = (
  value: string | number | boolean | null,
): string => {
  if (value === null) {
    return 'None';
  }

  if (typeof value === 'boolean') {
    return value ? 'True' : 'False';
  }

  return JSON.stringify(value);
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

    return `input(${promptText})`;
  }

  if (
    expression.callee.kind === IRKind.Identifier &&
    expression.callee.name === 'output'
  ) {
    return `print(${expression.args.map(getTextFromExpression).join(', ')})`;
  }

  return `${getTextFromExpression(expression.callee)}(${expression.args
    .map(getTextFromExpression)
    .join(', ')})`;
};

const getTextFromBinaryExpression = (
  expression: BinaryExpressionIR | LogicalExpressionIR,
): string => {
  const operator =
    expression.kind === IRKind.BinaryExpression
      ? BINARY_OPERATORS[expression.operator]
      : LOGICAL_OPERATORS[expression.operator];

  return `(${getTextFromExpression(expression.left)} ${operator} ${getTextFromExpression(
    expression.right,
  )})`;
};

const getTextFromUnaryExpression = (expression: UnaryExpressionIR): string => {
  return `${UNARY_OPERATORS[expression.operator]}${getTextFromExpression(
    expression.argument,
  )}`;
};

const getTextFromExpression = (expression: ExpressionIR): string => {
  switch (expression.kind) {
    case IRKind.Literal:
      return getTextFromLiteral(expression.value);

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
        ? `${indent}${statement.name} = ${getTextFromExpression(
            statement.init,
          )}`
        : `${indent}${statement.name} = None`;

    case IRKind.Assignment:
      return `${indent}${getTextFromPattern(
        statement.target,
      )} = ${getTextFromExpression(statement.value)}`;

    case IRKind.ExpressionStatement:
      return `${indent}${getTextFromExpression(statement.expression)}`;

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

      return `${indent}if ${getTextFromExpression(
        statement.test,
      )}:\n${consequent}${alternate}`;
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

export const getTextFromIR = (program: ProgramIR): string => {
  return getTextFromStatements(program.body, 0);
};
