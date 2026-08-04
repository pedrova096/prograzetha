import { createId } from '@paralleldrive/cuid2';

import { NodeStates, NodeTypes, type NodeState } from './base.types';

export class Node<T = unknown> {
  constructor(
    public id: string,
    public type: NodeTypes,
    public data: T = null as T,
    public parent?: string,
    public state: NodeState = NodeStates.Ok,
  ) {}

  public withUpdate(data = this.data, state = this.state) {
    return new Node(this.id, this.type, data, this.parent, state);
  }
}

export type NodeInstance<T = unknown> = Node<T>;

export type ExtractNodePayload<T> = T extends NodeInstance<infer R> ? R : never;
