import { createId } from '@paralleldrive/cuid2';
import type {
  ExpressionStatement,
  Identifier,
  Literal,
  TemplateElement,
  TemplateLiteral,
  VariableDeclaration,
} from 'estree';

import type { Recordable } from '~/lib/types';
import { OutputTraceCallbackNode } from './outputNode.trace';

import { Node, NodeTypes } from '../base';
import type { OutputNodeData, OutputNodeOptions } from './outputNode.types';

export class OutputNode extends Node<OutputNodeData> {
  constructor(
    id = createId(),
    type = NodeTypes.Output,
    data = { text: '', tree: null } as OutputNodeData,
  ) {
    super(id, type, data);
  }

  public static create() {
    return new OutputNode();
  }

  private getTemplateLiteral() {
    const src = this.data.text;
    let m: RegExpExecArray | null;

    const quasis: TemplateElement[] = [];
    const expressions: Identifier[] = [];

    let lastIndex = 0;

    while ((m = /@(\w+)/.exec(src)) !== null) {
      {
        const atIndex = m.index;
        const name = m[1];
        const idStart = atIndex + 1;
        const idEnd = idStart + name.length;

        const beforeText = src.slice(lastIndex, atIndex);
        quasis.push({
          type: 'TemplateElement',
          value: { raw: beforeText, cooked: beforeText },
          tail: false,
        });

        expressions.push({ type: 'Identifier', name });

        lastIndex = idEnd;
      }

      if (expressions.length === 0) {
        return {
          type: 'Literal',
          value: src,
          raw: JSON.stringify(src),
        } as Literal;
      }

      const tailText = src.slice(lastIndex);
      quasis.push({
        type: 'TemplateElement',
        value: { raw: tailText, cooked: tailText },
        tail: true,
      });

      for (let i = 0; i < quasis.length; i++) {
        (quasis[i] as TemplateElement).tail = i === quasis.length - 1;
      }

      const template: TemplateLiteral = {
        type: 'TemplateLiteral',
        expressions,
        quasis,
      };

      return template;
    }
  }

  toAST(options: OutputNodeOptions): ExpressionStatement | VariableDeclaration {
    const templateLiteral = this.getTemplateLiteral();

    return {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: { type: 'Identifier', name: 'console.log' },
        arguments: templateLiteral ? [templateLiteral] : [],
        optional: false,
      },
    };
  }

  public withData(data: OutputNodeData) {
    return new OutputNode(this.id, this.type, data);
  }

  public getTrace(env: Recordable): OutputTraceCallbackNode {
    return new OutputTraceCallbackNode(this.data, env);
  }
}
