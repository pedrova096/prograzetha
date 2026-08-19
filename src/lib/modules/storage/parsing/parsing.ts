import type { NodeState, NodeTypes } from '../../nodes';
import {
  CURRENT_PROGRAM_VERSION,
  EDGE_KINDS,
  NODE_STATES,
  NODE_TYPES,
  PROGRAM_DOCUMENT_SCHEMA,
} from './parsing.constants';
import { SerializedEdgeKind } from './parsing.types';
import type {
  ProgramDocument,
  SerializedEdge,
  SerializedGraph,
  SerializedNode,
} from './parsing.types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const assertString = (value: unknown, field: string) => {
  if (typeof value !== 'string')
    throw new Error(`El campo "${field}" debe ser texto.`);
  return value;
};

const parseNode = (value: unknown, index: number): SerializedNode => {
  if (!isRecord(value)) {
    throw new Error(`El nodo ${index + 1} no es válido.`);
  }

  const id = assertString(value.id, `nodes[${index}].id`);
  const type = assertString(value.type, `nodes[${index}].type`);
  const state = assertString(value.state, `nodes[${index}].state`);

  if (!id) throw new Error('Los nodos deben tener un identificador.');
  if (!NODE_TYPES.has(type))
    throw new Error(`Tipo de nodo desconocido: ${type}.`);
  if (!NODE_STATES.has(state)) {
    throw new Error(`Estado de nodo desconocido: ${state}.`);
  }

  return {
    id,
    type: type as NodeTypes,
    data: value.data,
    state: state as NodeState,
  };
};

const parseEdge = (value: unknown, index: number): SerializedEdge => {
  if (!isRecord(value)) {
    throw new Error(`La conexión ${index + 1} no es válida.`);
  }

  const kind = assertString(value.kind, `edges[${index}].kind`);
  if (!EDGE_KINDS.has(kind)) {
    throw new Error(`Tipo de conexión desconocido: ${kind}.`);
  }

  const edge: SerializedEdge = {
    kind: kind as SerializedEdgeKind,
    source: assertString(value.source, `edges[${index}].source`),
    target: assertString(value.target, `edges[${index}].target`),
    previous: assertString(value.previous, `edges[${index}].previous`),
  };

  if (edge.kind === SerializedEdgeKind.Branch) {
    edge.left = assertString(value.left, `edges[${index}].left`);
    edge.right = assertString(value.right, `edges[${index}].right`);
  }

  if (edge.kind === SerializedEdgeKind.Loop) {
    edge.body = assertString(value.body, `edges[${index}].body`);
  }

  return edge;
};

const validateReferences = (graph: SerializedGraph) => {
  const nodeIds = new Set<string>();
  const edgeSources = new Set<string>();

  for (const node of graph.nodes) {
    if (nodeIds.has(node.id)) {
      throw new Error(`El nodo “${node.id}” está duplicado.`);
    }
    nodeIds.add(node.id);
  }

  if (!nodeIds.has(graph.start)) {
    throw new Error('El nodo inicial no existe.');
  }

  const requireNode = (id: string, field: string) => {
    if (id && !nodeIds.has(id)) {
      throw new Error(
        `La referencia "${field}" apunta al nodo inexistente "${id}".`,
      );
    }
  };

  for (const edge of graph.edges) {
    if (edgeSources.has(edge.source)) {
      throw new Error(`La conexión de "${edge.source}" está duplicada.`);
    }
    edgeSources.add(edge.source);
    requireNode(edge.source, 'source');
    requireNode(edge.target, 'target');
    requireNode(edge.previous, 'previous');
    if (edge.kind === SerializedEdgeKind.Branch) {
      requireNode(edge.left ?? '', 'left');
      requireNode(edge.right ?? '', 'right');
    }
    if (edge.kind === SerializedEdgeKind.Loop) {
      requireNode(edge.body ?? '', 'body');
    }
  }
};

export const parseDocument = (value: unknown): ProgramDocument => {
  if (!isRecord(value) || !isRecord(value.graph)) {
    throw new Error('El archivo no contiene un grafo válido.');
  }

  if (value.schema !== PROGRAM_DOCUMENT_SCHEMA) {
    throw new Error('El esquema del programa no es compatible.');
  }

  if (value.version !== CURRENT_PROGRAM_VERSION) {
    throw new Error(
      `La versión del programa no es compatible. Esta aplicación requiere la versión ${CURRENT_PROGRAM_VERSION}.`,
    );
  }

  const { graph } = value;
  if (!Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
    throw new Error('Los nodos y conexiones deben ser listas.');
  }

  const document: ProgramDocument = {
    schema: PROGRAM_DOCUMENT_SCHEMA,
    version: CURRENT_PROGRAM_VERSION,
    graph: {
      start: assertString(graph.start, 'graph.start'),
      nodes: graph.nodes.map(parseNode),
      edges: graph.edges.map(parseEdge),
    },
  };

  validateReferences(document.graph);
  return document;
};
