import { onDestroy, onMount } from 'svelte';

import { debounce } from '~/lib/utils';
import type { Graph, GraphState } from '../graph';
import { checkInvalidNodeState } from '../graph';
import { saveProgramLocally, loadLocalProgram } from './storage.utils';
const SAVE_DEBOUNCE_MS = 500;

export const setStorageAutoSaving = (graph: Graph) => {
  const showError = (prefix: string, error: unknown) => {};

  const saveProgram = debounce((program: GraphState) => {
    try {
      const isInvalid = checkInvalidNodeState(program.nodes);

      if (isInvalid === 'NEW') return;
      if (isInvalid == 'ERROR') {
        throw Error('Hay nodos con error');
      }
      saveProgramLocally(program);
    } catch (error) {
      showError('No se pudo guardar el programa', error);
    }
  }, SAVE_DEBOUNCE_MS);

  $effect(() => {
    saveProgram({
      nodes: graph.nodes,
      edges: graph.edges,
      start: graph.start,
    });
  });

  onDestroy(saveProgram.flush);
};

export const loadLocalProgramOnMount = (graph: Graph) => {
  onMount(() => {
    const loadedGraph = loadLocalProgram();

    if (!loadedGraph) return;

    graph.reset(loadedGraph);
  });
};
