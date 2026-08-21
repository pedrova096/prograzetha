import { TokenType } from './tokenizer.types';
import type { Token } from './tokenizer.types';

export const JS_OPERATORS = [
  '+=',
  '-=',
  '===',
  '!==',
  '>=',
  '<=',
  '==',
  '!=',
  '&&',
  '||',
  '**',
  '+',
  '-',
  '*',
  '/',
  '%',
  '>',
  '<',
  '!',
  '=',
];

export const PYTHON_OPERATORS = [
  '>=',
  '<=',
  '==',
  '!=',
  '**',
  '+',
  '-',
  '*',
  '/',
  '%',
  '>',
  '<',
  '=',
];

export const KEYWORD_TOKENS: Record<string, Token> = {
  and: { type: TokenType.Operator, value: '&&' },
  or: { type: TokenType.Operator, value: '||' },
  not: { type: TokenType.Operator, value: '!' },
  True: { type: TokenType.Identifier, value: 'true' },
  False: { type: TokenType.Identifier, value: 'false' },
  None: { type: TokenType.Identifier, value: 'null' },
};
