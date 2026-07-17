import { ExpressionKind } from './expression.types';
import type { Expression } from './expression.types';
import { tokenizeJavascriptExpression, TokenType } from './tokenizer';
import type { Token, Tokenizer } from './tokenizer';
import {
  BINARY_OPERATORS,
  LOGICAL_OPERATORS,
  PRECEDENCE,
  UNARY_OPERATORS,
} from './expression.constants';

export class ExpressionParser {
  protected index = 0;
  protected readonly tokens: Token[];

  constructor(
    tokens: Token[],
    private readonly tokenizer: Tokenizer,
  ) {
    this.tokens = tokens.filter((token) => token.type !== TokenType.Newline);
  }

  parse(): Expression {
    const expression = this.parseExpression();

    while (this.match(TokenType.Semicolon)) {
      this.consume();
    }

    this.expect(TokenType.EOF);
    return expression;
  }

  protected parseExpression(): Expression {
    return this.parseConditionalExpression();
  }

  protected parseConditionalExpression(): Expression {
    const test = this.parseBinaryExpression(0);

    if (!this.match(TokenType.Question)) {
      return test;
    }

    this.consume();
    const consequent = this.parseExpression();
    this.expect(TokenType.Colon);
    const alternate = this.parseExpression();

    return {
      kind: ExpressionKind.ConditionalExpression,
      test,
      consequent,
      alternate,
    };
  }

  protected parseBinaryExpression(minPrecedence: number): Expression {
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
          kind: ExpressionKind.LogicalExpression,
          operator: LOGICAL_OPERATORS[token.value],
          left,
          right,
        };
      } else {
        left = {
          kind: ExpressionKind.BinaryExpression,
          operator: BINARY_OPERATORS[token.value],
          left,
          right,
        };
      }
    }

    return left;
  }

  protected parseUnaryExpression(): Expression {
    const token = this.peek();

    if (token.type === TokenType.Operator && UNARY_OPERATORS[token.value]) {
      this.consume();

      return {
        kind: ExpressionKind.UnaryExpression,
        operator: UNARY_OPERATORS[token.value],
        argument: this.parseUnaryExpression(),
      };
    }

    return this.parsePostfixExpression();
  }

  protected parsePostfixExpression(): Expression {
    let expression = this.parsePrimaryExpression();

    while (true) {
      if (this.match(TokenType.Paren, '(')) {
        expression = {
          kind: ExpressionKind.CallExpression,
          callee: expression,
          args: this.parseArguments(),
        };
        continue;
      }

      if (this.match(TokenType.Dot)) {
        this.consume();
        const property = this.expect(TokenType.Identifier);

        expression = {
          kind: ExpressionKind.MemberExpression,
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
          kind: ExpressionKind.MemberExpression,
          object: expression,
          property: this.getPropertyName(property),
        };
        continue;
      }

      break;
    }

    return expression;
  }

  protected parsePrimaryExpression(): Expression {
    const token = this.peek();

    if (token.type === TokenType.Number) {
      this.consume();

      return {
        kind: ExpressionKind.Literal,
        value: Number(token.value),
      };
    }

    if (token.type === TokenType.String) {
      this.consume();

      return {
        kind: ExpressionKind.Literal,
        value: token.value,
      };
    }

    if (token.type === TokenType.Template) {
      this.consume();

      return {
        kind: ExpressionKind.TemplateLiteral,
        parts: this.parseTemplateParts(token.value),
      };
    }

    if (token.type === TokenType.Identifier) {
      this.consume();

      if (token.value === 'true') {
        return {
          kind: ExpressionKind.Literal,
          value: true,
        };
      }

      if (token.value === 'false') {
        return {
          kind: ExpressionKind.Literal,
          value: false,
        };
      }

      if (token.value === 'null') {
        return {
          kind: ExpressionKind.Literal,
          value: null,
        };
      }

      return {
        kind: ExpressionKind.Identifier,
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

  protected parseArguments(): Expression[] {
    this.expect(TokenType.Paren, '(');

    const args = this.parseExpressionList(TokenType.Paren, ')');

    this.expect(TokenType.Paren, ')');
    return args;
  }

  protected parseArrayExpression(): Expression {
    this.expect(TokenType.Bracket, '[');

    const elements = this.parseExpressionList(TokenType.Bracket, ']');

    this.expect(TokenType.Bracket, ']');

    return {
      kind: ExpressionKind.ArrayExpression,
      elements,
    };
  }

  protected parseObjectExpression(): Expression {
    const properties: { key: string; value: Expression }[] = [];

    this.expect(TokenType.Brace, '{');

    while (!this.match(TokenType.Brace, '}')) {
      const key = this.parseObjectKey();
      const value: Expression = this.match(TokenType.Colon)
        ? (this.consume(), this.parseExpression())
        : {
            kind: ExpressionKind.Identifier,
            name: key,
          };

      properties.push({ key, value });

      if (!this.match(TokenType.Comma)) break;

      this.consume();
      if (this.match(TokenType.Brace, '}')) break;
    }

    this.expect(TokenType.Brace, '}');

    return {
      kind: ExpressionKind.ObjectExpression,
      properties,
    };
  }

  protected parseExpressionList(
    endType: Token['type'],
    endValue: Token['value'],
  ): Expression[] {
    const expressions: Expression[] = [];

    while (!this.match(endType, endValue)) {
      expressions.push(this.parseExpression());

      if (!this.match(TokenType.Comma)) break;

      this.consume();
      if (this.match(endType, endValue)) break;
    }

    return expressions;
  }

  protected parseObjectKey(): string {
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

  protected parseTemplateParts(source: string): Array<string | Expression> {
    const parts: Array<string | Expression> = [];
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

        parts.push(
          new ExpressionParser(
            this.tokenizer(expression),
            this.tokenizer,
          ).parse(),
        );
        continue;
      }

      text += source[i];
      i++;
    }

    if (text) parts.push(text);

    return parts;
  }

  protected getPropertyName(expression: Expression): string {
    if (expression.kind === ExpressionKind.Identifier) return expression.name;
    if (expression.kind === ExpressionKind.Literal) {
      return String(expression.value);
    }

    return 'unknown';
  }

  protected peek(): Token {
    return this.tokens[this.index];
  }

  protected match(type: Token['type'], value?: Token['value']): boolean {
    const token = this.peek();

    if (token.type !== type) return false;

    return value === undefined || token.value === value;
  }

  protected matchIdentifier(value: string): boolean {
    return this.match(TokenType.Identifier, value);
  }

  protected consume(): Token {
    return this.tokens[this.index++];
  }

  protected expect(type: Token['type'], value?: Token['value']): Token {
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

export const parseExpression = (
  source: string,
  tokenizer: Tokenizer = tokenizeJavascriptExpression,
): Expression => new ExpressionParser(tokenizer(source), tokenizer).parse();
