<script lang="ts">
  import { Play, Settings, Code, GitCommitVertical } from 'lucide-svelte';
  import { Sidebar } from '../Sidebar';
  import type { SidebarDrawerProps } from './SidebarDrawer.types';

  let { class: className, ...props }: SidebarDrawerProps = $props();

  let collapsed = $state(false);
</script>

<div {...props} class={['z-10 h-full', className]}>
  <Sidebar.Root bind:collapsed class="h-full">
    <Sidebar.CollapseTrigger />

    <Sidebar.Header>
      <div
        class="flex size-9 items-center justify-center rounded-lg bg-zinc-900 text-sm font-bold text-white"
      >
        P
      </div>
      {#if !collapsed}
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-zinc-900">
            Prograzetha
          </p>
          <p class="truncate text-xs text-zinc-500">Workspace</p>
        </div>
      {/if}
    </Sidebar.Header>

    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.Action icon={GitCommitVertical} label="Nodo">
          {#snippet panel()}{/snippet}
        </Sidebar.Action>
      </Sidebar.Group>

      <Sidebar.Divider />

      <Sidebar.Group>
        <Sidebar.Action icon={Code} label="Código">
          {#snippet panel()}{/snippet}
        </Sidebar.Action>
        <Sidebar.Item icon={Play} label="Ejecutar" />
      </Sidebar.Group>

      <Sidebar.Divider />

      <Sidebar.Group class="mt-auto">
        <Sidebar.Item icon={Settings} label="Configuración" />
      </Sidebar.Group>
    </Sidebar.Content>
  </Sidebar.Root>
</div>
