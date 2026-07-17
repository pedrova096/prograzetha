import {
  ExpressionKind,
  parseExpression,
  tokenizePythonExpression,
  type Expression,
} from '~/lib/modules/expression';
import { inferExpressionType } from '~/utils';

import { IRKind } from '../../ir.types';
import type { ProgramIR, StatementIR } from '../../ir.types';
import type { PythonLine } from './python.types';

const ASSIGNMENT_PATTERN = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/;

const normalizeLines = (source: string): PythonLine[] =>
  source
    .replace(/\t/g, '    ')
    .split(/\r?\n/)
    .map((raw) => {
      const text = raw.trim();
      return {
        indent: raw.length - raw.trimStart().length,
        text,
      };
    })
    .filter((line) => line.text && !line.text.startsWith('#'));

const parsePythonExpression = (source: string): Expression =>
  parseExpression(source, tokenizePythonExpression);

class PythonProgramParser {
  private index = 0;
  private readonly declarations = new Set<string>();

  constructor(private readonly lines: PythonLine[]) {}

  parseProgram(): ProgramIR {
    return {
      kind: IRKind.Program,
      body: this.parseBlock(0),
    };
  }

  private parseBlock(indent: number): StatementIR[] {
    const body: StatementIR[] = [];

    while (this.index < this.lines.length) {
      const line = this.peek();

      if (line.indent < indent) break;

      if (line.indent > indent) {
        throw new Error(`Unexpected indentation before: ${line.text}`);
      }

      if (line.text === 'pass') {
        this.consume();
        continue;
      }

      if (line.text.startsWith('else:')) {
        break;
      }

      body.push(this.parseStatement(indent));
    }

    return body;
  }

  private parseStatement(indent: number): StatementIR {
    const line = this.peek();

    if (line.text.startsWith('if ') && line.text.endsWith(':')) {
      return this.parseIfStatement(indent);
    }

    return this.parseSimpleStatement();
  }

  private parseIfStatement(indent: number): StatementIR {
    const line = this.consume();
    const testSource = line.text.slice(3, -1).trim();
    const test = parsePythonExpression(testSource);
    const consequent = this.parseNestedBlock(indent);
    let alternate: StatementIR[] | undefined;

    if (
      this.index < this.lines.length &&
      this.peek().indent === indent &&
      this.peek().text === 'else:'
    ) {
      this.consume();
      alternate = this.parseNestedBlock(indent);
    }

    return {
      kind: IRKind.If,
      test,
      consequent,
      alternate,
    };
  }

  private parseNestedBlock(parentIndent: number): StatementIR[] {
    if (this.index >= this.lines.length || this.peek().indent <= parentIndent) {
      return [];
    }

    return this.parseBlock(this.peek().indent);
  }

  private parseSimpleStatement(): StatementIR {
    const line = this.consume();
    const assignment = ASSIGNMENT_PATTERN.exec(line.text);

    if (assignment) {
      const [, name, valueSource] = assignment;
      const value = parsePythonExpression(valueSource);

      if (this.declarations.has(name)) {
        return {
          kind: IRKind.Assignment,
          target: {
            kind: IRKind.IdentifierPattern,
            name,
          },
          value,
        };
      }

      this.declarations.add(name);

      return {
        kind: IRKind.VariableDeclaration,
        name,
        init: value,
        valueType: inferExpressionType(value),
      };
    }

    const expression = parsePythonExpression(line.text);

    if (
      expression.kind !== ExpressionKind.CallExpression ||
      expression.callee.kind !== ExpressionKind.Identifier ||
      expression.callee.name !== 'output'
    ) {
      throw new Error('Only output(...) expression statements are supported');
    }

    return {
      kind: IRKind.ExpressionStatement,
      expression,
    };
  }

  private peek(): PythonLine {
    return this.lines[this.index];
  }

  private consume(): PythonLine {
    return this.lines[this.index++];
  }
}

export const decodeProgram = (source: string): ProgramIR =>
  new PythonProgramParser(normalizeLines(source)).parseProgram();
