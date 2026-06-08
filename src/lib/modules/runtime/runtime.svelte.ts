import { wait } from '~/utils/fp';
import { executeProgram, isEdgeTraverse } from './runtime';
import { PlayerStatus, RuntimeEvents } from './runtime.types';
import type {
  PendingInput,
  RuntimeContext,
  RuntimeEvent,
  RuntimeNode,
  RuntimeServices,
  RuntimeSpeed,
} from './runtime.types';
import { DEFAULT_SPEED } from './runtime.constants';

export class RuntimePlayer {
  program = $state<RuntimeNode[]>([]);
  context = $state<RuntimeContext>({ variables: {} });
  status = $state<PlayerStatus>(PlayerStatus.Idle);

  activeNodeId = $state<string | null>(null);
  activeEdge = $state<{ from: string; to: string } | null>(null);
  // chosenBranches = $state<Record<string, 'then' | 'else'>>({});
  events = $state<RuntimeEvent[]>([]);
  pendingInput = $state<PendingInput | null>(null);

  traverseNodeIds = $derived(
    new Set(this.events.filter(isEdgeTraverse).map((event) => event.from)),
  );

  speed = DEFAULT_SPEED;

  private iterator: AsyncGenerator<RuntimeEvent> | null = null;
  private services: RuntimeServices;

  constructor(options: {
    services: RuntimeServices;
    program: RuntimeNode[];
    speed?: RuntimeSpeed;
  }) {
    const { program, services, speed = DEFAULT_SPEED } = options;
    this.program = program;
    this.services = services;
    this.speed = speed;
  }

  private reset() {
    this.status = PlayerStatus.Idle;
    this.activeNodeId = null;
    this.activeEdge = null;
    this.events = [];
    this.context = { variables: {} };
    this.pendingInput = null;
  }

  async play() {
    if (this.status === PlayerStatus.Running) return;

    if (!this.iterator || this.status === PlayerStatus.Done) {
      this.reset();
      this.iterator = executeProgram(this.program, this.context, this.services);
    }

    this.status = PlayerStatus.Running;

    while (this.status === PlayerStatus.Running) {
      const result = await this.iterator!.next();

      if (result.done) {
        this.status = PlayerStatus.Done;
        break;
      }

      const event = result.value;

      this.applyEvent(event);

      if (event.type === RuntimeEvents.ExecutionEnd) {
        this.status = PlayerStatus.Done;
        break;
      }

      await wait(this.getEventDuration(event));
    }
  }

  private getEventDuration(event: RuntimeEvent): number {
    switch (event.type) {
      case RuntimeEvents.NodeProcess:
        return this.speed.nodeMs;

      case RuntimeEvents.EdgeTraverse:
        return this.speed.edgeMs;

      case RuntimeEvents.BranchChoose:
        return this.speed.branchMs;

      case RuntimeEvents.ContextUpdate:
        return this.speed.contextMs;

      default:
        return 0;
    }
  }

  pause() {
    if (this.status === PlayerStatus.Running) {
      this.status = PlayerStatus.Paused;
    }
  }

  stop() {
    this.iterator = null;
    this.status = PlayerStatus.Idle;
    this.reset();
  }

  private applyEvent(event: RuntimeEvent) {
    this.events = [...this.events, event];

    switch (event.type) {
      case RuntimeEvents.NodeProcess: {
        this.activeEdge = null;
        this.activeNodeId = event.nodeId;
        return;
      }

      case RuntimeEvents.EdgeTraverse: {
        this.activeNodeId = null;
        this.activeEdge = {
          from: event.from,
          to: event.to,
        };

        return;
      }

      case RuntimeEvents.BranchChoose: {
        // this.chosenBranches = {
        //   ...this.chosenBranches,
        //   [event.nodeId]: event.branch,
        // };

        return;
      }

      case RuntimeEvents.ContextUpdate: {
        this.context = {
          variables: { ...event.variables },
        };

        return;
      }

      case RuntimeEvents.ExecutionEnd: {
        this.activeNodeId = null;
        this.activeEdge = null;
        this.status = PlayerStatus.Done;
        return;
      }
    }
  }
}
