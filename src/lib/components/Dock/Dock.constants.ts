import { NodeTypes } from '~/lib/modules/nodes';
import type { Component } from 'svelte';
import { ConditionPanel } from './ConditionPanel';
import { EndPanel } from './EndPanel';
import { ForLoopPanel } from './ForLoopPanel';
import { InputPanel } from './InputPanel';
import { OperationPanel } from './OperationPanel';
import { OutputPanel } from './OutputPanel';
import { StartPanel } from './StartPanel';
import { WhileLoopPanel } from './WhileLoopPanel';
import { GitCommitVertical, Settings } from '@lucide/svelte';
import { EXECUTION_ICON_LABEL } from './ExecutionPanel/ExecutionPanel.constants';
import { CODE_ICON_LABEL } from './CodePanel/CodePanel.constants';
import { STORAGE_ICON_LABEL } from './StoragePanel/StoragePanel.constants';
import type { NodePanelProps } from './Panel.types';

export enum DockRoutes {
  Home = '/',
  Root = '/dock',
  NodeTypeId = '/dock/node/:type/:id',
  Node = '/dock/node',
  Code = '/dock/code',
  Execution = '/dock/execution',
  Storage = '/dock/storage',
}

export const NODE_COMPONENTS = {
  [NodeTypes.Start]: StartPanel,
  [NodeTypes.End]: EndPanel,
  [NodeTypes.Input]: InputPanel,
  [NodeTypes.Output]: OutputPanel,
  [NodeTypes.Condition]: ConditionPanel,
  [NodeTypes.Operation]: OperationPanel,
  [NodeTypes.WhileLoop]: WhileLoopPanel,
  [NodeTypes.ForLoop]: ForLoopPanel,
} as unknown as Record<NodeTypes, Component<NodePanelProps>>;

export const NAV_ITEMS = {
  Execution: EXECUTION_ICON_LABEL,
  Code: CODE_ICON_LABEL,
  Storage: STORAGE_ICON_LABEL,
  Settings: { icon: Settings, label: 'Configuración' },
  Node: { icon: GitCommitVertical, label: 'Nodo' },
};
