import type { RuntimeEvents } from '~/lib/modules/runtime';

export type OutputEvent = {
  type: RuntimeEvents.ActionAlert;
  nodeId: string;
  message: string;
};

export type OutputSectionProps = { events: OutputEvent[] };
