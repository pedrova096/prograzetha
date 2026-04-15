import type { HTMLAttributes } from 'svelte/elements';
import type { Node } from '~/App.mock';

export type NodeProps = HTMLAttributes<HTMLDivElement> & {
  node: Node;
};
