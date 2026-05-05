import { createId } from '@paralleldrive/cuid2';
import type { Directive, ModuleDeclaration, Statement } from 'estree';

import type { Recordable } from '~/lib/types';

import { NodeTypes } from './base.types';

export class Node<T = unknown> {
  constructor(
    public id: string,
    public type: NodeTypes,
    public data: T = null as T,
    public parent?: string,
  ) {}

  public withData(data: T) {
    return new Node(this.id, this.type, data);
  }

  public toAST(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    payload?: unknown,
  ): Directive | Statement | ModuleDeclaration | null {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getTrace(env: Recordable) {
    // return TraceBlock.create();
  }
}

export const createNode = <T>(options: {
  type: NodeTypes;
  data?: T;
  next?: Node;
  prev?: Node;
}) => {
  const { type, data = null } = options;
  return new Node<T>(createId(), type, data as T);
};

export type NodeInstance<T = unknown> = Node<T>;

export type ExtractNodePayload<T> = T extends NodeInstance<infer R> ? R : never;
