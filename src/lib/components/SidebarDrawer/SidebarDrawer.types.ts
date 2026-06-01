import type { HTMLAttributes } from 'svelte/elements';
import type { Node } from '~/lib/modules/nodes';

export interface SidebarDrawerProps extends HTMLAttributes<HTMLDivElement> {}

export interface FormNodeDrawer<TNode extends Node = Node> {
  node: TNode | null;
  onSave: (node: TNode) => void;
  onDismiss?: (node: Node) => void;
  onClose?: () => void;
}
