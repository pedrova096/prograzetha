import { NodeStates, NodeTypes } from '../../nodes';
import { SerializedEdgeKind } from './parsing.types';

export const PROGRAM_DOCUMENT_SCHEMA = 'prograzetha-program';
export const CURRENT_PROGRAM_VERSION = 1;

export const NODE_TYPES = new Set<string>(Object.values(NodeTypes));
export const NODE_STATES = new Set<string>(Object.values(NodeStates));
export const EDGE_KINDS = new Set<string>(Object.values(SerializedEdgeKind));
