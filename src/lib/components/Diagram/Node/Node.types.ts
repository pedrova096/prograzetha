import type { HTMLAttributes } from 'svelte/elements';
import type { Node } from '~/lib/modules/nodes';

export type NodeProps = HTMLAttributes<HTMLDivElement> & {
  node: Node;
};
