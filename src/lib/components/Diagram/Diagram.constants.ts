import type { Component } from 'svelte';
import type { NodeProps } from './Node';
import { InputNode } from './InputNode';
import { OutputNode } from './OutputNode';
import { OperationNode } from './OperationNode';
import { LoopNode } from './LoopNode';
import { NodeTypes } from '~/lib/modules/nodes';

export const MIN_DIAGRAM_ZOOM = 0.35;
export const MAX_DIAGRAM_ZOOM = 2;
export const DIAGRAM_ZOOM_STEP = 0.15;
export const DIAGRAM_VIEW_PADDING = 48;

export const NODE_COMPONENTS: Partial<Record<NodeTypes, Component<NodeProps>>> =
  {
    [NodeTypes.Input]: InputNode,
    [NodeTypes.Output]: OutputNode,
    [NodeTypes.Operation]: OperationNode,
    [NodeTypes.WhileLoop]: LoopNode,
    [NodeTypes.ForLoop]: LoopNode,
  };
