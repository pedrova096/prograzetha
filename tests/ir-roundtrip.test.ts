import { describe, expect, test } from 'bun:test';

import { ExpressionKind } from '../src/lib/modules/expression';
import { IRKind } from '../src/lib/modules/ir';
import { decodeProgram } from '../src/lib/modules/ir/languages/javascript';

describe('javascript IR newline statement parsing', () => {
  test('accepts repeated newlines as statement separators', () => {
    const program = decodeProgram(`
      let x = 1


      x = 2
    `);

    expect(program.body.map((statement) => statement.kind)).toEqual([
      IRKind.VariableDeclaration,
      IRKind.Assignment,
    ]);
  });

  test('accepts mixed semicolon and newline statement separators', () => {
    const program = decodeProgram(`
      let x = 1;
      x = 2
    `);

    expect(program.body.map((statement) => statement.kind)).toEqual([
      IRKind.VariableDeclaration,
      IRKind.Assignment,
    ]);
  });

  test('accepts final statement without semicolon or trailing newline', () => {
    const program = decodeProgram('let x = 1\nx = 2');

    expect(program.body.map((statement) => statement.kind)).toEqual([
      IRKind.VariableDeclaration,
      IRKind.Assignment,
    ]);
  });

  test('accepts statement before closing brace without semicolon', () => {
    const program = decodeProgram(`
      if (x) {
        y = 1
      }
    `);

    const statement = program.body[0];

    expect(statement.kind).toBe(IRKind.If);
    if (statement.kind !== IRKind.If) return;

    expect(statement.consequent.map((child) => child.kind)).toEqual([
      IRKind.Assignment,
    ]);
  });

  test('attaches else after newlines following a closing brace', () => {
    const program = decodeProgram(`
      if (a) {
        x = 1
      }


      else {
        x = 2
      }
    `);

    const statement = program.body[0];

    expect(statement.kind).toBe(IRKind.If);
    if (statement.kind !== IRKind.If) return;

    expect(statement.consequent.map((child) => child.kind)).toEqual([
      IRKind.Assignment,
    ]);
    expect(statement.alternate?.map((child) => child.kind)).toEqual([
      IRKind.Assignment,
    ]);
  });

  test('accepts parenthesized multiline expressions', () => {
    const program = decodeProgram(`
      let x = (
        a + b
      )
    `);

    const statement = program.body[0];

    expect(statement.kind).toBe(IRKind.VariableDeclaration);
    if (statement.kind !== IRKind.VariableDeclaration) return;

    expect(statement.init?.kind).toBe(ExpressionKind.BinaryExpression);
  });

  test('accepts assignment values with grouped multiline call expressions', () => {
    const program = decodeProgram(`
      x = foo(
        a,
        b
      )
    `);

    const statement = program.body[0];

    expect(statement.kind).toBe(IRKind.Assignment);
    if (statement.kind !== IRKind.Assignment) return;

    expect(statement.value.kind).toBe(ExpressionKind.CallExpression);
  });

  test('keeps newlines inside template literals', () => {
    const program = decodeProgram('let x = `hello\n${name}`');
    const statement = program.body[0];

    expect(statement.kind).toBe(IRKind.VariableDeclaration);
    if (statement.kind !== IRKind.VariableDeclaration) return;

    expect(statement.init?.kind).toBe(ExpressionKind.TemplateLiteral);
    if (statement.init?.kind !== ExpressionKind.TemplateLiteral) return;

    expect(statement.init.parts[0]).toBe('hello\n');
  });

  test('accepts unparenthesized newline continuation after a binary operator', () => {
    const program = decodeProgram(`
      let x = a +
        b
    `);

    const statement = program.body[0];

    expect(statement.kind).toBe(IRKind.VariableDeclaration);
    if (statement.kind !== IRKind.VariableDeclaration) return;

    expect(statement.init?.kind).toBe(ExpressionKind.BinaryExpression);
  });

  test('accepts unparenthesized newline continuation before a binary operator', () => {
    const program = decodeProgram(`
      let x = a
        + b
    `);

    const statement = program.body[0];

    expect(program.body).toHaveLength(1);
    expect(statement.kind).toBe(IRKind.VariableDeclaration);
    if (statement.kind !== IRKind.VariableDeclaration) return;

    expect(statement.init?.kind).toBe(ExpressionKind.BinaryExpression);
  });
});
