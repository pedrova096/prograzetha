export class Edge {
  constructor(
    public source: string,
    public target: string,
  ) {}

  public static create(source: string, target: string) {
    return new Edge(source, target);
  }
}

export class BranchEdge extends Edge {
  constructor(
    source: string,
    target: string,
    public left: string,
    public right: string,
  ) {
    super(source, target);
  }

  static override create(source: string, target: string): Edge;
  static override create(
    source: string,
    target: string,
    left: string,
    right: string,
  ): BranchEdge;
  static override create(
    source: string,
    target: string,
    left?: string,
    right?: string,
  ): Edge {
    if (left === undefined || right === undefined) {
      return Edge.create(source, target);
    }

    return new BranchEdge(source, target, left, right);
  }
}

export class LoopEdge extends Edge {
  constructor(
    source: string,
    target: string,
    public body: string,
  ) {
    super(source, target);
  }

  static override create(source: string, target: string): Edge;
  static override create(
    source: string,
    target: string,
    body: string,
  ): LoopEdge;
  static override create(
    source: string,
    target: string,
    body?: string,
  ): Edge {
    if (body === undefined) {
      return Edge.create(source, target);
    }

    return new LoopEdge(source, target, body);
  }
}
