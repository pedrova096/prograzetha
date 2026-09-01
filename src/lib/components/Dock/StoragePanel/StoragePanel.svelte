<script lang="ts">
  import { CircleCheck, Download, Upload } from '@lucide/svelte';
  import { getGraphContext } from '~/App.context.svelte';
  import { downloadProgram, importProgram } from '~/lib/modules/storage/storage.utils';
  import { Panel } from '../Panel';
  import { OperationKind, OperationState, type OperationUnion } from './OperationState';
  import {
    DEFAULT_ERROR_MESSAGE,
    STORAGE_ICON_LABEL,
    SUCCESS_EXPORT,
    SUCCESS_IMPORT,
  } from './StoragePanel.constants';

  const graph = getGraphContext();
  let importInput = $state<HTMLInputElement | null>(null);
  let operation = $state<OperationUnion | null>(null);

  const getErrorOperation = (error: unknown): OperationUnion => ({
    kind: OperationKind.Error,
    message: error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE,
  });

  const onImport = async (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      graph.replace(await importProgram(file));
      operation = SUCCESS_IMPORT;
    } catch (error) {
      operation = getErrorOperation(error);
    } finally {
      input.value = '';
    }
  };

  const onExport = () => {
    try {
      downloadProgram(graph);
      operation = SUCCESS_EXPORT;
    } catch (error) {
      operation = getErrorOperation(error);
    }
  };
</script>

<Panel.Root>
  <Panel.Header {...STORAGE_ICON_LABEL} />
  <Panel.Divider />

  <Panel.Content>
    <div class="flex min-h-0 w-80 flex-col gap-5 overflow-y-auto">
      <section class="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
        <CircleCheck class="mt-0.5 size-4 shrink-0 text-emerald-700" />
        <div>
          <h3 class="text-sm font-medium text-emerald-900">Guardado automático activo</h3>
          <p class="mt-1 text-xs leading-5 text-emerald-800">
            Los cambios se guardan localmente y se restauran al recargar.
          </p>
        </div>
      </section>

      <section>
        <h3 class="text-sm font-semibold text-zinc-900">Importar y exportar</h3>
        <p class="mt-1 text-xs leading-5 text-zinc-500">
          Comparte programas mediante archivos JSON versionados.
        </p>
        <div class="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            onclick={() => importInput?.click()}
          >
            <Upload class="size-4" />
            Importar
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            onclick={onExport}
          >
            <Download class="size-4" />
            Exportar
          </button>
        </div>
        <input
          bind:this={importInput}
          type="file"
          accept="application/json,.json"
          class="sr-only"
          aria-label="Seleccionar programa JSON"
          onchange={onImport}
        />

        {#if operation}
          <OperationState {...operation} />
        {/if}
      </section>
    </div>
  </Panel.Content>
</Panel.Root>
