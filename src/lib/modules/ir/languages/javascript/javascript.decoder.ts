import {
  IRKind,
  type ExpressionIR,
  type ProgramIR,
  type StatementIR,
} from '../../ir.types';
import {
  BINARY_OPERATORS,
  LOGICAL_OPERATORS,
  OPERATORS,
  UNARY_OPERATORS,
  PRECEDENCE,
} from './javascript.constants';
import { TokenType } from './javascript.type';
import type { Token } from './javascript.type';

const tokenizeExpression = (source: string): Token[] => {
  const tokens: Token[] = [];
  let i = 0;

  while (i < source.length) {
    const char = source[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    if (char === '(' || char === ')') {
      tokens.push({ type: TokenType.Paren, value: char });
      i++;
      continue;
    }

    if (char === '[' || char === ']') {
      tokens.push({ type: TokenType.Bracket, value: char });
      i++;
      continue;
    }

    if (char === '{' || char === '}') {
      tokens.push({ type: TokenType.Brace, value: char });
      i++;
      continue;
    }

    if (char === ',') {
      tokens.push({ type: TokenType.Comma, value: ',' });
      i++;
      continue;
    }

    if (char === '.') {
      tokens.push({ type: TokenType.Dot, value: '.' });
      i++;
      continue;
    }

    if (char === ':') {
      tokens.push({ type: TokenType.Colon, value: ':' });
      i++;
      continue;
    }

    if (char === '?') {
      tokens.push({ type: TokenType.Question, value: '?' });
      i++;
      continue;
    }

    if (char === ';') {
      tokens.push({ type: TokenType.Semicolon, value: ';' });
      i++;
      continue;
    }

    if (char === '`') {
      let value = '';
      i++;

      while (i < source.length && source[i] !== '`') {
        if (source[i] === '\\' && i + 1 < source.length) {
          value += source[i] + source[i + 1];
          i += 2;
          continue;
        }

        value += source[i];
        i++;
      }

      if (source[i] !== '`') {
        throw new Error('Unterminated template literal');
      }

      i++;
      tokens.push({ type: TokenType.Template, value });
      continue;
    }

    if (char === '"' || char === "'") {
      const quote = char;
      let value = '';
      i++;

      while (i < source.length && source[i] !== quote) {
        value += source[i];
        i++;
      }

      if (source[i] !== quote) {
        throw new Error('Unterminated string literal');
      }

      i++;
      tokens.push({ type: TokenType.String, value });
      continue;
    }

    if (/\d/.test(char)) {
      let value = '';

      while (i < source.length && /[\d.]/.test(source[i])) {
        value += source[i];
        i++;
      }

      tokens.push({ type: TokenType.Number, value });
      continue;
    }

    if (/[a-zA-Z_$]/.test(char)) {
      let value = '';

      while (i < source.length && /[a-zA-Z0-9_$]/.test(source[i])) {
        value += source[i];
        i++;
      }

      tokens.push({ type: TokenType.Identifier, value });
      continue;
    }

    const operator = OPERATORS.find((op) => source.startsWith(op, i));

    if (operator) {
      tokens.push({ type: TokenType.Operator, value: operator });
      i += operator.length;
      continue;
    }

    throw new Error(`Unexpected character: ${char}`);
  }

  tokens.push({ type: TokenType.EOF, value: '' });

  return tokens;
};

class ExpressionParser {
  private index = 0;

  constructor(private readonly tokens: Token[]) {}

  parse(): ExpressionIR {
    const expression = this.parseExpression();

    while (this.match(TokenType.Semicolon)) {
      this.consume();
    }

    this.expect(TokenType.EOF);
    return expression;
  }

  parseProgram(): ProgramIR {
    const body: StatementIR[] = [];

    while (!this.match(TokenType.EOF)) {
      if (this.match(TokenType.Semicolon)) {
        this.consume();
        continue;
      }

      body.push(this.parseStatement());
    }

    return {
      kind: IRKind.Program,
      body,
    };
  }

  private parseExpression(): ExpressionIR {
    return this.parseConditionalExpression();
  }

  private parseStatement(): StatementIR {
    if (this.matchIdentifier('let')) {
      return this.parseVariableDeclaration();
    }

    if (this.matchIdentifier('if')) {
      return this.parseIfStatement();
    }

    return this.parseExpressionOrAssignmentStatement();
  }

  private parseVariableDeclaration(): StatementIR {
    this.expect(TokenType.Identifier, 'let');

    const name = this.expect(TokenType.Identifier).value;
    const statement: StatementIR = {
      kind: IRKind.VariableDeclaration,
      name,
    };

    if (this.match(TokenType.Operator, '=')) {
      this.consume();
      statement.init = this.parseExpression();
    }

    this.consumeStatementEnd();
    return statement;
  }

  private parseIfStatement(): StatementIR {
    this.expect(TokenType.Identifier, 'if');
    this.expect(TokenType.Paren, '(');

    const test = this.parseExpression();

    this.expect(TokenType.Paren, ')');

    const consequent = this.parseStatementBlock();
    let alternate: StatementIR[] | undefined;

    if (this.matchIdentifier('else')) {
      this.consume();
      alternate = this.matchIdentifier('if')
        ? [this.parseIfStatement()]
        : this.parseStatementBlock();
    }

    return {
      kind: IRKind.If,
      test,
      consequent,
      alternate,
    };
  }

  private parseStatementBlock(): StatementIR[] {
    this.expect(TokenType.Brace, '{');

    const body: StatementIR[] = [];

    while (!this.match(TokenType.Brace, '}')) {
      if (this.match(TokenType.EOF)) {
        throw new Error('Unterminated block statement');
      }

      if (this.match(TokenType.Semicolon)) {
        this.consume();
        continue;
      }

      body.push(this.parseStatement());
    }

    this.expect(TokenType.Brace, '}');
    return body;
  }

  private parseExpressionOrAssignmentStatement(): StatementIR {
    const expression = this.parseExpression();

    if (this.match(TokenType.Operator, '=')) {
      this.consume();

      if (expression.kind !== IRKind.Identifier) {
        throw new Error('Assignment target must be an identifier');
      }

      const value = this.parseExpression();

      this.consumeStatementEnd();

      return {
        kind: IRKind.Assignment,
        target: {
          kind: IRKind.IdentifierPattern,
          name: expression.name,
        },
        value,
      };
    }

    this.consumeStatementEnd();

    return {
      kind: IRKind.ExpressionStatement,
      expression,
    };
  }

  private consumeStatementEnd(): void {
    if (!this.match(TokenType.Semicolon)) return;

    while (this.match(TokenType.Semicolon)) {
      this.consume();
    }
  }

  private parseConditionalExpression(): ExpressionIR {
    const test = this.parseBinaryExpression(0);

    if (!this.match(TokenType.Question)) {
      return test;
    }

    this.consume();
    const consequent = this.parseExpression();
    this.expect(TokenType.Colon);
    const alternate = this.parseExpression();

    return {
      kind: IRKind.ConditionalExpression,
      test,
      consequent,
      alternate,
    };
  }

  private parseBinaryExpression(minPrecedence: number): ExpressionIR {
    let left = this.parseUnaryExpression();

    while (true) {
      const token = this.peek();

      if (token.type !== TokenType.Operator) break;

      const precedence = PRECEDENCE[token.value];

      if (precedence === undefined || precedence < minPrecedence) break;

      this.consume();

      const right = this.parseBinaryExpression(precedence + 1);

      if (LOGICAL_OPERATORS[token.value]) {
        left = {
          kind: IRKind.LogicalExpression,
          operator: LOGICAL_OPERATORS[token.value],
          left,
          right,
        };
      } else {
        left = {
          kind: IRKind.BinaryExpression,
          operator: BINARY_OPERATORS[token.value],
          left,
          right,
        };
      }
    }

    return left;
  }

  private parseUnaryExpression(): ExpressionIR {
    const token = this.peek();

    if (token.type === TokenType.Operator && UNARY_OPERATORS[token.value]) {
      this.consume();

      return {
        kind: IRKind.UnaryExpression,
        operator: UNARY_OPERATORS[token.value],
        argument: this.parseUnaryExpression(),
      };
    }

    return this.parsePostfixExpression();
  }

  private parsePostfixExpression(): ExpressionIR {
    let expression = this.parsePrimaryExpression();

    while (true) {
      if (this.match(TokenType.Paren, '(')) {
        expression = {
          kind: IRKind.CallExpression,
          callee: expression,
          args: this.parseArguments(),
        };
        continue;
      }

      if (this.match(TokenType.Dot)) {
        this.consume();
        const property = this.expect(TokenType.Identifier);

        expression = {
          kind: IRKind.MemberExpression,
          object: expression,
          property: property.value,
        };
        continue;
      }

      if (this.match(TokenType.Bracket, '[')) {
        this.consume();
        const property = this.parseExpression();
        this.expect(TokenType.Bracket, ']');

        expression = {
          kind: IRKind.MemberExpression,
          object: expression,
          property: this.getPropertyName(property),
        };
        continue;
      }

      break;
    }

    return expression;
  }

  private parsePrimaryExpression(): ExpressionIR {
    const token = this.peek();

    if (token.type === TokenType.Number) {
      this.consume();

      return {
        kind: IRKind.Literal,
        value: Number(token.value),
      };
    }

    if (token.type === TokenType.String) {
      this.consume();

      return {
        kind: IRKind.Literal,
        value: token.value,
      };
    }

    if (token.type === TokenType.Template) {
      this.consume();

      return {
        kind: IRKind.TemplateLiteral,
        parts: this.parseTemplateParts(token.value),
      };
    }

    if (token.type === TokenType.Identifier) {
      this.consume();

      if (token.value === 'true') {
        return {
          kind: IRKind.Literal,
          value: true,
        };
      }

      if (token.value === 'false') {
        return {
          kind: IRKind.Literal,
          value: false,
        };
      }

      if (token.value === 'null') {
        return {
          kind: IRKind.Literal,
          value: null,
        };
      }

      return {
        kind: IRKind.Identifier,
        name: token.value,
      };
    }

    if (token.type === TokenType.Paren && token.value === '(') {
      this.consume();

      const expression = this.parseExpression();

      this.expect(TokenType.Paren, ')');

      return expression;
    }

    if (token.type === TokenType.Bracket && token.value === '[') {
      return this.parseArrayExpression();
    }

    if (token.type === TokenType.Brace && token.value === '{') {
      return this.parseObjectExpression();
    }

    throw new Error(`Unexpected token: ${token.type} ${token.value}`);
  }

  private parseArguments(): ExpressionIR[] {
    this.expect(TokenType.Paren, '(');

    const args = this.parseExpressionList(TokenType.Paren, ')');

    this.expect(TokenType.Paren, ')');
    return args;
  }

  private parseArrayExpression(): ExpressionIR {
    this.expect(TokenType.Bracket, '[');

    const elements = this.parseExpressionList(TokenType.Bracket, ']');

    this.expect(TokenType.Bracket, ']');

    return {
      kind: IRKind.ArrayExpression,
      elements,
    };
  }

  private parseObjectExpression(): ExpressionIR {
    const properties: { key: string; value: ExpressionIR }[] = [];

    this.expect(TokenType.Brace, '{');

    while (!this.match(TokenType.Brace, '}')) {
      const key = this.parseObjectKey();
      const value: ExpressionIR = this.match(TokenType.Colon)
        ? (this.consume(), this.parseExpression())
        : {
            kind: IRKind.Identifier,
            name: key,
          };

      properties.push({ key, value });

      if (!this.match(TokenType.Comma)) break;

      this.consume();
      if (this.match(TokenType.Brace, '}')) break;
    }

    this.expect(TokenType.Brace, '}');

    return {
      kind: IRKind.ObjectExpression,
      properties,
    };
  }

  private parseExpressionList(
    endType: Token['type'],
    endValue: Token['value'],
  ): ExpressionIR[] {
    const expressions: ExpressionIR[] = [];

    while (!this.match(endType, endValue)) {
      expressions.push(this.parseExpression());

      if (!this.match(TokenType.Comma)) break;

      this.consume();
      if (this.match(endType, endValue)) break;
    }

    return expressions;
  }

  private parseObjectKey(): string {
    const token = this.consume();

    if (
      token.type === TokenType.Identifier ||
      token.type === TokenType.String ||
      token.type === TokenType.Number
    ) {
      return token.value;
    }

    throw new Error(`Expected object key, got ${token.type} ${token.value}`);
  }

  private parseTemplateParts(source: string): Array<string | ExpressionIR> {
    const parts: Array<string | ExpressionIR> = [];
    let text = '';
    let i = 0;

    while (i < source.length) {
      if (source[i] === '$' && source[i + 1] === '{') {
        if (text) {
          parts.push(text);
          text = '';
        }

        i += 2;
        let expression = '';
        let depth = 1;

        while (i < source.length && depth > 0) {
          const char = source[i];

          if (char === '{') depth++;
          if (char === '}') depth--;

          if (depth > 0) expression += char;
          i++;
        }

        if (depth !== 0) {
          throw new Error('Unterminated template expression');
        }

        parts.push(new ExpressionParser(tokenizeExpression(expression)).parse());
        continue;
      }

      text += source[i];
      i++;
    }

    if (text) parts.push(text);

    return parts;
  }

  private getPropertyName(expression: ExpressionIR): string {
    if (expression.kind === IRKind.Identifier) return expression.name;
    if (expression.kind === IRKind.Literal) return String(expression.value);

    return 'unknown';
  }

  private peek(): Token {
    return this.tokens[this.index];
  }

  private match(type: Token['type'], value?: Token['value']): boolean {
    const token = this.peek();

    if (token.type !== type) return false;

    return value === undefined || token.value === value;
  }

  private matchIdentifier(value: string): boolean {
    return this.match(TokenType.Identifier, value);
  }

  private consume(): Token {
    return this.tokens[this.index++];
  }

  private expect(type: Token['type'], value?: Token['value']): Token {
    const token = this.consume();

    if (token.type !== type) {
      throw new Error(`Expected ${type}, got ${token.type}`);
    }

    if (value !== undefined && token.value !== value) {
      throw new Error(`Expected ${value}, got ${token.value}`);
    }

    return token;
  }
}

export const decodeExpression = (source: string): ExpressionIR => {
  const tokens = tokenizeExpression(source);
  const parser = new ExpressionParser(tokens);

  return parser.parse();
};

export const decodeProgram = (source: string): ProgramIR => {
  const tokens = tokenizeExpression(source);
  const parser = new ExpressionParser(tokens);

  return parser.parseProgram();
};
