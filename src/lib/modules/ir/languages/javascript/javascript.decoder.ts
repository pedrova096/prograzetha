import {
  PRECEDENCE,
  ExpressionKind,
  UnaryOperator,
  parseExpression,
  tokenizeJavascriptExpression,
  TokenType,
  type Token,
} from '~/lib/modules/expression';
import { inferExpressionType } from '~/utils';

import { IRKind, type ProgramIR, type StatementIR } from '../../ir.types';

class ProgramParser {
  private index = 0;

  constructor(private readonly tokens: Token[]) {}

  parseProgram(): ProgramIR {
    const body: StatementIR[] = [];

    while (!this.match(TokenType.EOF)) {
      if (this.matchStatementSeparator()) {
        this.consumeStatementEnd();
        continue;
      }

      body.push(this.parseStatement());
    }

    return {
      kind: IRKind.Program,
      body,
    };
  }

  private parseStatement(): StatementIR {
    if (this.matchIdentifier('let')) return this.parseVariableDeclaration();
    if (this.matchIdentifier('if')) return this.parseIfStatement();
    if (this.matchIdentifier('while')) return this.parseWhileStatement();
    if (this.matchIdentifier('for')) return this.parseForStatement();

    return this.parseExpressionOrAssignmentStatement();
  }

  private parseVariableDeclaration(): StatementIR {
    this.expect(TokenType.Identifier, 'let');

    const name = this.expect(TokenType.Identifier).value;
    let init;

    if (this.match(TokenType.Operator, '=')) {
      this.consume();
      init = this.parseExpressionUntilStatementEnd();
    }

    this.consumeStatementEnd();

    return {
      kind: IRKind.VariableDeclaration,
      name,
      init,
      valueType: init ? inferExpressionType(init) : undefined,
    };
  }

  private parseIfStatement(): StatementIR {
    this.expect(TokenType.Identifier, 'if');
    this.expect(TokenType.Paren, '(');

    const test = this.parseExpressionUntil(
      (token, depth) =>
        depth === 0 && token.type === TokenType.Paren && token.value === ')',
    );

    this.expect(TokenType.Paren, ')');

    const consequent = this.parseStatementBlock();
    let alternate: StatementIR[] | undefined;

    this.consumeNewlines();

    if (this.matchIdentifier('else')) {
      this.consume();
      alternate = this.parseStatementBlock();
    }

    return {
      kind: IRKind.If,
      test,
      consequent,
      alternate,
    };
  }

  private parseWhileStatement(): StatementIR {
    this.expect(TokenType.Identifier, 'while');
    this.expect(TokenType.Paren, '(');
    const test = this.parseExpressionUntil(
      (token, depth) =>
        depth === 0 && token.type === TokenType.Paren && token.value === ')',
    );
    this.expect(TokenType.Paren, ')');

    return {
      kind: IRKind.While,
      test,
      body: this.parseStatementBlock(),
    };
  }

  private parseForStatement(): StatementIR {
    this.expect(TokenType.Identifier, 'for');
    this.expect(TokenType.Paren, '(');
    this.expect(TokenType.Identifier, 'let');
    const iterator = this.expect(TokenType.Identifier).value;
    this.expect(TokenType.Operator, '=');
    const start = this.parseExpressionUntil(
      (token, depth) => depth === 0 && token.type === TokenType.Semicolon,
    );
    this.expect(TokenType.Semicolon);

    const conditionIterator = this.expect(TokenType.Identifier).value;
    if (conditionIterator !== iterator) {
      throw new Error('For loop condition must use its iterator');
    }

    const comparator = this.expect(TokenType.Operator).value;
    if (comparator !== '<' && comparator !== '>') {
      throw new Error('For loop must use an exclusive < or > comparison');
    }

    const end = this.parseExpressionUntil(
      (token, depth) => depth === 0 && token.type === TokenType.Semicolon,
    );
    this.expect(TokenType.Semicolon);

    const updateIterator = this.expect(TokenType.Identifier).value;
    if (updateIterator !== iterator) {
      throw new Error('For loop update must use its iterator');
    }
    this.expect(TokenType.Operator, '+=');
    const step = this.parseExpressionUntil(
      (token, depth) =>
        depth === 0 && token.type === TokenType.Paren && token.value === ')',
    );
    this.expect(TokenType.Paren, ')');

    const stepValue = this.getIntegerLiteral(step);
    if (stepValue === null || stepValue === 0) {
      throw new Error('For loop step must be a non-zero integer literal');
    }
    if ((stepValue > 0 && comparator !== '<') || (stepValue < 0 && comparator !== '>')) {
      throw new Error('For loop comparison does not match its step direction');
    }

    return {
      kind: IRKind.ForRange,
      iterator,
      start,
      end,
      step,
      body: this.parseStatementBlock(),
    };
  }

  private getIntegerLiteral(expression: ReturnType<typeof parseExpression>) {
    if (
      expression.kind === ExpressionKind.Literal &&
      typeof expression.value === 'number' &&
      Number.isInteger(expression.value)
    ) {
      return expression.value;
    }

    if (
      expression.kind === ExpressionKind.UnaryExpression &&
      expression.operator === UnaryOperator.Negative &&
      expression.argument.kind === ExpressionKind.Literal &&
      typeof expression.argument.value === 'number' &&
      Number.isInteger(expression.argument.value)
    ) {
      return -expression.argument.value;
    }

    return null;
  }

  private parseStatementBlock(): StatementIR[] {
    this.expect(TokenType.Brace, '{');

    const body: StatementIR[] = [];

    while (!this.match(TokenType.Brace, '}')) {
      if (this.match(TokenType.EOF)) {
        throw new Error('Unterminated block statement');
      }

      if (this.matchStatementSeparator()) {
        this.consumeStatementEnd();
        continue;
      }

      body.push(this.parseStatement());
    }

    this.expect(TokenType.Brace, '}');
    return body;
  }

  private parseExpressionOrAssignmentStatement(): StatementIR {
    const expression = this.parseExpressionUntilAssignmentOrStatementEnd();

    if (this.match(TokenType.Operator, '=')) {
      this.consume();

      if (expression.kind !== 'Identifier') {
        throw new Error('Assignment target must be an identifier');
      }

      const value = this.parseExpressionUntilStatementEnd();

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

  private parseExpressionUntilAssignmentOrStatementEnd() {
    return this.parseExpressionUntil((token, depth) => {
      if (depth !== 0) return false;

      return (
        this.isStatementEndToken(token) ||
        (token.type === TokenType.Operator && token.value === '=')
      );
    });
  }

  private parseExpressionUntilStatementEnd() {
    return this.parseExpressionUntil(
      (token, depth) => depth === 0 && this.isStatementEndToken(token),
    );
  }

  private parseExpressionUntil(
    shouldStop: (token: Token, depth: number) => boolean,
  ) {
    const start = this.index;
    let depth = 0;

    while (!this.match(TokenType.EOF)) {
      const token = this.peek();

      if (shouldStop(token, depth)) break;

      if (
        token.type === TokenType.Paren ||
        token.type === TokenType.Bracket ||
        token.type === TokenType.Brace
      ) {
        if (token.value === '(' || token.value === '[' || token.value === '{') {
          depth++;
        } else {
          depth--;
        }
      }

      this.consume();
    }

    const source = this.tokensToSource(this.tokens.slice(start, this.index));

    if (!source) {
      throw new Error('Expected expression');
    }

    return parseExpression(source, tokenizeJavascriptExpression);
  }

  private consumeStatementEnd(): void {
    while (this.matchStatementSeparator()) {
      this.consume();
    }
  }

  private consumeNewlines(): void {
    while (this.match(TokenType.Newline)) {
      this.consume();
    }
  }

  private matchStatementSeparator(): boolean {
    return this.match(TokenType.Semicolon) || this.match(TokenType.Newline);
  }

  private isStatementEndToken(token: Token): boolean {
    const previousToken = this.tokens[this.index - 1];
    const nextToken = this.tokens[this.index + 1];
    if (
      token.type === TokenType.Newline &&
      (this.isBinaryOperator(previousToken) || this.isBinaryOperator(nextToken))
    ) {
      return false;
    }

    return (
      token.type === TokenType.Semicolon ||
      token.type === TokenType.Newline ||
      token.type === TokenType.EOF ||
      (token.type === TokenType.Brace && token.value === '}')
    );
  }

  private isBinaryOperator(token: Token | undefined): boolean {
    return (
      token?.type === TokenType.Operator &&
      token.value !== '=' &&
      PRECEDENCE[token.value] !== undefined
    );
  }

  private tokensToSource(tokens: Token[]) {
    return tokens
      .map((token) => {
        if (token.type === TokenType.String) {
          return JSON.stringify(token.value);
        }

        if (token.type === TokenType.Template) {
          return `\`${token.value.replace(/[`\\]/g, '\\$&')}\``;
        }

        return token.value;
      })
      .join(' ');
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

export const decodeProgram = (source: string): ProgramIR =>
  new ProgramParser(tokenizeJavascriptExpression(source)).parseProgram();
