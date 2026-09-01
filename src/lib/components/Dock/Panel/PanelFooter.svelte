<script lang="ts">
  import PanelGroup from './PanelGroup.svelte';
  import type { PanelGroupProps } from './Panel.types';

  let { class: className, ...props }: PanelGroupProps = $props();
</script>

<PanelGroup {...props} class={['mt-auto', className]} />
