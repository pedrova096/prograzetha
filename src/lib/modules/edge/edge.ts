export class Edge {
  constructor(
    public source: string,
    public target: string,
  ) {}

  public static create(source: string, target: string) {
    return new Edge(source, target);
  }
}

export class ConditionalEdge extends Edge {
  left: string;
  right: string;

  private constructor(
    source: string,
    target: string,
    left: string,
    right: string,
  ) {
    super(source, target);
    this.left = left;
    this.right = right;
  }

  static override create(source: string, target: string): Edge;
  static override create(
    source: string,
    target: string,
    left: string,
    right: string,
  ): ConditionalEdge;
  static override create(
    source: string,
    target: string,
    left?: string,
    right?: string,
  ): Edge {
    if (left === undefined || right === undefined) {
      return Edge.create(source, target);
    }

    return new ConditionalEdge(source, target, left, right);
  }
}
