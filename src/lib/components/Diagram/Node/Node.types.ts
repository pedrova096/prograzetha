import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { Node } from '~/lib/modules/nodes';

export type NodeProps = HTMLAttributes<HTMLDivElement> & {
  node: Node;
  onDelete?: (node: Node) => void;
  children?: Snippet;
};
