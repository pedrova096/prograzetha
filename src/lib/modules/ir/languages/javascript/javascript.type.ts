export enum TokenType {
  Number = 'number',
  String = 'string',
  Identifier = 'identifier',
  Operator = 'operator',
  Paren = 'paren',
  Bracket = 'bracket',
  Brace = 'brace',
  Comma = 'comma',
  Dot = 'dot',
  Colon = 'colon',
  Question = 'question',
  Semicolon = 'semicolon',
  Template = 'template',
  EOF = 'eof',
}

export type Token =
  | { type: `${TokenType.Number}`; value: string }
  | { type: `${TokenType.String}`; value: string }
  | { type: `${TokenType.Identifier}`; value: string }
  | { type: `${TokenType.Operator}`; value: string }
  | { type: `${TokenType.Paren}`; value: '(' | ')' }
  | { type: `${TokenType.Bracket}`; value: '[' | ']' }
  | { type: `${TokenType.Brace}`; value: '{' | '}' }
  | { type: `${TokenType.Comma}`; value: ',' }
  | { type: `${TokenType.Dot}`; value: '.' }
  | { type: `${TokenType.Colon}`; value: ':' }
  | { type: `${TokenType.Question}`; value: '?' }
  | { type: `${TokenType.Semicolon}`; value: ';' }
  | { type: `${TokenType.Template}`; value: string }
  | { type: `${TokenType.EOF}`; value: '' };
