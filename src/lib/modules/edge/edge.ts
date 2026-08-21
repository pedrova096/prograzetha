import { BranchEdgeSide } from './edge.types';

export class Edge {
  constructor(
    public source: string,
    public target: string,
    public previous: string,
  ) {}

  public static create(source: string, target: string, previous: string = '') {
    return new Edge(source, target, previous);
  }

  public withTarget(target: string) {
    return this.withUpdate(target, this.previous);
  }

  public withPrevious(previous: string) {
    return this.withUpdate(this.target, previous);
  }

  public withUpdate(
    target: string = this.target,
    previous: string = this.previous,
  ) {
    return new Edge(this.source, target, previous);
  }
}

export class BranchEdge extends Edge {
  constructor(
    source: string,
    target: string,
    previous: string,
    public left: string,
    public right: string,
  ) {
    super(source, target, previous);
  }

  static override create(
    source: string,
    target: string,
    previous: string,
  ): Edge;
  static override create(
    source: string,
    target: string,
    previous: string,
    left: string,
    right: string,
  ): BranchEdge;
  static override create(
    source: string,
    target: string,
    previous: string,
    left?: string,
    right?: string,
  ): Edge {
    if (left === undefined || right === undefined) {
      return Edge.create(source, target, previous);
    }

    return new BranchEdge(source, target, previous, left, right);
  }

  static fromEdge(
    edge: Edge,
    left: string = '',
    right: string = '',
  ): BranchEdge {
    return new BranchEdge(edge.source, edge.target, edge.previous, left, right);
  }

  public override withUpdate(
    target: string = this.target,
    previous: string = this.previous,
  ) {
    return new BranchEdge(this.source, target, previous, this.left, this.right);
  }

  public withBranchSide(side: BranchEdgeSide, value: string) {
    return new BranchEdge(
      this.source,
      this.target,
      this.previous,
      side === BranchEdgeSide.Left ? value : this.left,
      side === BranchEdgeSide.Right ? value : this.right,
    );
  }
}

export class LoopEdge extends Edge {
  constructor(
    source: string,
    target: string,
    previous: string,
    public body: string,
  ) {
    super(source, target, previous);
  }

  static override create(
    source: string,
    target: string,
    previous: string,
  ): Edge;
  static override create(
    source: string,
    target: string,
    previous: string,
    body: string,
  ): LoopEdge;
  static override create(
    source: string,
    target: string,
    previous: string,
    body?: string,
  ): Edge {
    if (body === undefined) {
      return Edge.create(source, target, previous);
    }

    return new LoopEdge(source, target, previous, body);
  }

  static fromEdge(edge: Edge, body: string = ''): LoopEdge {
    return new LoopEdge(edge.source, edge.target, edge.previous, body);
  }

  public override withUpdate(
    target: string = this.target,
    previous: string = this.previous,
  ) {
    return new LoopEdge(this.source, target, previous, this.body);
  }

  public withBody(body: string) {
    return new LoopEdge(this.source, this.target, this.previous, body);
  }
}
