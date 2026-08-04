import { getContext, setContext } from 'svelte';

import type { RuntimeContext, RuntimeState } from './App.types';
import type { Graph, GraphState } from './lib/modules/graph';
import { getRuntimeProgram, RuntimePlayer } from './lib/modules/runtime';

const GRAPH_KEY = Symbol('GRAPH');
const RUNTIME_KEY = Symbol('RUNTIME');

const createRuntime = (graph: GraphState) => {
  return new RuntimePlayer({
    program: getRuntimeProgram(
      { nodes: graph.nodes, edges: graph.edges },
      graph.start,
    ),
    services: {
      output: async () => {},
      inputNumber: async () => {
        const rawValue = globalThis.prompt?.('Ingrese un número');

        if (!rawValue) {
          throw new Error('Debe ingresar un número.');
        }

        const value = Number(rawValue);

        if (!Number.isFinite(value)) {
          throw new Error('La entrada debe ser un número válido.');
        }

        return value;
      },
      inputText: async () => globalThis.prompt?.('Ingrese texto') ?? '',
    },
  });
};

const tryCreateRuntime = (graph: GraphState): RuntimeState => {
  try {
    return { kind: 'ready', runtime: createRuntime(graph) };
  } catch (error) {
    return {
      kind: 'error',
      error: error as Error,
    };
  }
};

export const setGraphContext = (graph: Graph) => {
  return setContext<Graph>(GRAPH_KEY, graph);
};

export const getGraphContext = () => {
  return getContext<Graph>(GRAPH_KEY);
};

export const setRuntimeContext = () => {
  const graph = getGraphContext();
  const context = $state<RuntimeContext>({
    runtimeState: tryCreateRuntime(graph),
  });

  $effect(() => {
    context.runtimeState = tryCreateRuntime(graph);
  });

  return setContext(RUNTIME_KEY, context);
};

export const getRuntimeContext = () => {
  return getContext<ReturnType<typeof setRuntimeContext>>(RUNTIME_KEY);
};
