import type { Component } from 'svelte';
import type { NodeProps } from './Node';
import { InputNode } from './InputNode';
import { OutputNode } from './OutputNode';
import { OperationNode } from './OperationNode';
import { LoopNode } from './LoopNode';
import { NodeTypes } from '~/lib/modules/nodes';

export const NODE_COMPONENTS: Partial<Record<NodeTypes, Component<NodeProps>>> =
  {
    [NodeTypes.Input]: InputNode,
    [NodeTypes.Output]: OutputNode,
    [NodeTypes.Operation]: OperationNode,
    [NodeTypes.WhileLoop]: LoopNode,
    [NodeTypes.ForLoop]: LoopNode,
  };
