<script lang="ts">
  import { Settings, Code } from 'lucide-svelte';
  import { getGraphContext } from '~/App.context.svelte';
  import {
    ConditionalNode,
    InputNode,
    NodeStates,
    OperationNode,
    OutputNode,
    type Node,
  } from '~/lib/modules/nodes';
  import { Sidebar } from '../Sidebar';
  import { InputDrawer } from './InputDrawer';
  import { ConditionalDrawer } from './ConditionalDrawer';
  import { OperationDrawer } from './OperationDrawer';
  import { OutputDrawer } from './OutputDrawer';
  import { ExecutionDrawer } from './ExecutionDrawer';
  import { DrawerRoutes, NodeRoutes } from './SidebarDrawer.constants';
  import type { SidebarDrawerProps } from './SidebarDrawer.types';
  import { navigate, Route, useLocation } from 'svelte-routing';
  import { tick } from 'svelte';
  import { CodeDrawer } from './CodeDrawer';
  import { StorageDrawer } from './StorageDrawer';

  let { class: className, ...props }: SidebarDrawerProps = $props();

  const graph = getGraphContext();
  let { nodes } = $derived(graph);

  let collapsed = $state(false);
  let actionId = $state<string | null>(null);
  const location = useLocation();
  const pathname = $derived($location.pathname);
  let previousPathname = $state(pathname);

  const closePanel = () => {
    actionId = null;
  };

  $effect(() => {
    if (pathname === previousPathname) return;

    if (!pathname.includes('/drawer')) {
      closePanel();
    }
    previousPathname = pathname;
  });

  const getInputNode = (id: string): InputNode | null => {
    const node = nodes.get(id);

    if (!node || !InputNode.nodeIs(node)) return null;

    return node;
  };

  const getConditionalNode = (id: string): ConditionalNode | null => {
    const node = nodes.get(id);

    if (!node || !ConditionalNode.nodeIs(node)) return null;

    return node;
  };

  const getOperationNode = (id: string): OperationNode | null => {
    const node = nodes.get(id);

    if (!node || !OperationNode.nodeIs(node)) return null;

    return node;
  };

  const getOutputNode = (id: string): OutputNode | null => {
    const node = nodes.get(id);

    if (!node || !OutputNode.nodeIs(node)) return null;

    return node;
  };

  const onSave = (node: Node) => {
    graph.updateNode(node);
    closePanel();
    navigate(DrawerRoutes.Home);
  };
  const onCloseNodePanel = () => {
    closePanel();
    navigate(DrawerRoutes.Home);
  };

  const toggleCodePanelRoute = () => {
    navigate(
      pathname === DrawerRoutes.Code ? DrawerRoutes.Home : DrawerRoutes.Code,
    );
  };

  const toggleExecutionPanelRoute = () => {
    navigate(
      pathname === DrawerRoutes.Execution
        ? DrawerRoutes.Home
        : DrawerRoutes.Execution,
    );
  };

  const toggleStoragePanelRoute = () => {
    navigate(
      pathname === DrawerRoutes.Storage
        ? DrawerRoutes.Home
        : DrawerRoutes.Storage,
    );
  };

  const onDismiss = async (nodeFromOption: Node) => {
    await tick();
    const node = nodes.get(nodeFromOption.id)!;
    if (node.state === NodeStates.New) {
      graph.updateNode(node.withUpdate(node.data, NodeStates.Error));
    }
  };
</script>

<div {...props} class={['z-10 h-full', className]}>
  <Sidebar.Root bind:collapsed bind:actionId class="h-full">
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
        <Route path={NodeRoutes.InputId} let:params>
          {#key params.id}
            <InputDrawer
              node={getInputNode(params.id)}
              {onSave}
              onClose={onCloseNodePanel}
              {onDismiss}
            />
          {/key}
        </Route>
        <Route path={NodeRoutes.ConditionId} let:params>
          {#key params.id}
            <ConditionalDrawer
              node={getConditionalNode(params.id)}
              {onSave}
              onClose={onCloseNodePanel}
              {onDismiss}
            />
          {/key}
        </Route>
        <Route path={NodeRoutes.OperationId} let:params>
          {#key params.id}
            <OperationDrawer
              node={getOperationNode(params.id)}
              {onSave}
              onClose={onCloseNodePanel}
              {onDismiss}
            />
          {/key}
        </Route>
        <Route path={NodeRoutes.OutputId} let:params>
          {#key params.id}
            <OutputDrawer
              node={getOutputNode(params.id)}
              {onSave}
              onClose={onCloseNodePanel}
              {onDismiss}
            />
          {/key}
        </Route>
      </Sidebar.Group>

      <Sidebar.Divider />

      <Sidebar.Group>
        <ExecutionDrawer
          active={pathname === DrawerRoutes.Execution}
          defaultOpenPanel={pathname === DrawerRoutes.Execution}
          onclick={toggleExecutionPanelRoute}
        />

        <CodeDrawer
          active={pathname === DrawerRoutes.Code}
          defaultOpenPanel={pathname === DrawerRoutes.Code}
          onclick={toggleCodePanelRoute}
        />

        <StorageDrawer
          active={pathname === DrawerRoutes.Storage}
          defaultOpenPanel={pathname === DrawerRoutes.Storage}
          onclick={toggleStoragePanelRoute}
        />
      </Sidebar.Group>

      <Sidebar.Divider />

      <Sidebar.Group class="mt-auto">
        <Sidebar.Item icon={Settings} label="Configuración" />
      </Sidebar.Group>
    </Sidebar.Content>
  </Sidebar.Root>
</div>
