<script lang="ts">
  import {
    ConditionNode,
    Node,
    AddButton,
    type NodeProps,
  } from '~/lib/components';
  import { NodeTypes } from '~/App.mock';
  import { default as Diagram } from './Diagram.svelte';
  import { addNode, getDiagramContext } from '~/App.context.svelte';
  import type { DiagramProps } from './Diagram.types';
  import type { Component } from 'svelte';

  let { from }: DiagramProps = $props();

  let {
    diagram: { nodes, edges },
  } = $derived(getDiagramContext());

  let current = $derived(nodes.get(from)!);
  let next = $derived(current ? edges.get(current.id)?.to : undefined);

  const NODE_MAP: Partial<Record<NodeTypes, Component<NodeProps>>> = {
    [NodeTypes.Condition]: ConditionNode,
  };

  let nodeType = $derived(current.type);
  let NodeComponent = $derived(NODE_MAP[nodeType] ?? Node);
</script>

<NodeComponent node={current} />
{#if next}
  <AddButton onSelect={() => addNode(current.id)} />
{/if}

{#if next}
  <Diagram from={next} />
{/if}
