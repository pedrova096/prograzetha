<script lang="ts">
  import { Route, useLocation } from 'svelte-routing';
  import { tick } from 'svelte';
  import { NodeStates, type Node } from '~/lib/modules/nodes';
  import { getGraphContext } from '~/App.context.svelte';
  import { getAppPathname, navigateTo } from '~/utils/navigation';

  import { Nav } from './Nav';
  import { SidePanel } from './SidePanel';
  import { CodePanel } from './CodePanel';
  import { ExecutionPanel } from './ExecutionPanel';
  import { StoragePanel } from './StoragePanel';
  import { DockRoutes, NAV_ITEMS, NODE_COMPONENTS } from './Dock.constants';
  import { matchesRoute } from './Dock.utils';

  const graph = getGraphContext();
  const location = useLocation();

  let { nodes } = $derived(graph);
  let pathname = $derived(getAppPathname($location.pathname));
  let isNodeRoute = $derived(matchesRoute(pathname, DockRoutes.NodeTypeId));
  let collapsed = $state(false);

  const onSave = (node: Node) => {
    graph.updateNode(node);
    navigateTo(DockRoutes.Home);
  };

  const onCloseNodePanel = () => {
    navigateTo(DockRoutes.Home);
  };

  const onDismiss = async (dismissedNode: Node) => {
    await tick();

    const node = nodes.get(dismissedNode.id);
    if (node?.state === NodeStates.New) {
      graph.updateNode(node.withUpdate(node.data, NodeStates.Error));
    }
  };
</script>

<SidePanel.Root>
  <Route path={DockRoutes.NodeTypeId} let:params>
    {@const nodeData = nodes.get(params.id)!}
    {@const NodeComponent = NODE_COMPONENTS[nodeData.type]}
    {#key params.id}
      <NodeComponent
        node={nodeData}
        {onSave}
        onClose={onCloseNodePanel}
        {onDismiss}
      />
    {/key}
  </Route>

  <Route path={DockRoutes.Execution}><ExecutionPanel /></Route>
  <Route path={DockRoutes.Code}><CodePanel /></Route>
  <Route path={DockRoutes.Storage}><StoragePanel /></Route>
</SidePanel.Root>

<Nav.Root bind:collapsed bind:pathname>
  <Nav.CollapseTrigger />
  <Nav.Header>
    <!--TODO: Add Logo-->
    <div
      class="flex size-9 items-center justify-center rounded-lg bg-zinc-900 text-sm font-bold text-white"
    >
      P
    </div>
    {#if !collapsed}
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-zinc-900">Prograzetha</p>
        <p class="truncate text-xs text-zinc-500">Controles</p>
      </div>
    {/if}
  </Nav.Header>

  <Nav.Divider />

  {#if isNodeRoute}
    <Nav.Group>
      <Nav.Item {...NAV_ITEMS.Node} to="#" active />
    </Nav.Group>
    
    <Nav.Divider />
  {/if}

  <Nav.Group>
    <Nav.Item {...NAV_ITEMS.Execution} to={DockRoutes.Execution} />
    <Nav.Item {...NAV_ITEMS.Code} to={DockRoutes.Code} />
    <Nav.Item {...NAV_ITEMS.Storage} to={DockRoutes.Storage} />
  </Nav.Group>

  <Nav.Divider />

  <Nav.Footer>
    <Nav.Item {...NAV_ITEMS.Settings} to="#" />
  </Nav.Footer>
</Nav.Root>
