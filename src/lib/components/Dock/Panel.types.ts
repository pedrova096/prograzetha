import type { Node } from '~/lib/modules/nodes';

export type FormNodePanel<TNode extends Node = Node> = {
  node: TNode | null;
  onSave: (node: TNode) => void;
  onClose?: () => void;
  onDismiss?: (node: Node) => void;
};

export type NodePanelProps = Partial<FormNodePanel>;
