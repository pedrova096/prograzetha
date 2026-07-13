import { JS_OPERATORS as OPERATORS } from './tokenizer.constants';
import { TokenType, type Token } from './tokenizer.types';

export const tokenizeJavascriptExpression = (source: string): Token[] => {
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

    const operator = OPERATORS.find((operator) =>
      source.startsWith(operator, i),
    );

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
