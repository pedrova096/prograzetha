export class Edge {
  constructor(
    public source: string,
    public target: string,
    public previous: string,
  ) {}

  public static create(source: string, target: string, previous: string) {
    return new Edge(source, target, previous);
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
}
