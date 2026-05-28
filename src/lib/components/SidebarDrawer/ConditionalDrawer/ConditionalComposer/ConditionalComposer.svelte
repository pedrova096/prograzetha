<script lang="ts">
  import { setConditionalComposer } from './ConditionalComposer.context';
  import type { ConditionalComposerProps } from './ConditionalComposer.types';
  import {
    addConditionChild,
    moveCondition,
    removeCondition,
    updateCondition,
  } from './ConditionalComposer.utils';
  import { ConditionalTree } from './ConditionalTree';

  let {
    name,
    value = $bindable(),
    onchange,
  }: ConditionalComposerProps = $props();

  const logChange = (
    action: string,
    details: Record<string, unknown>,
    previousValue: any,
  ) => {
    console.log(`[SortableConditionTree] ${action}`, {
      name,
      ...details,
      previousValue,
      nextValue: value,
    });
  };

  const dispatchChange = () => {
    onchange?.(
      new CustomEvent('change', {
        detail: { value, name },
      }),
    );
  };

  setConditionalComposer({
    addConditionChild: (path, child) => {
      const previousValue = value;
      value = addConditionChild(value, path, child);
      logChange('addConditionChild', { path, child }, previousValue);
      dispatchChange();
    },
    moveCondition: (options) => {
      const previousValue = value;
      value = moveCondition(value, options);
      logChange('moveCondition', { options }, previousValue);
      dispatchChange();
    },
    removeCondition: (path) => {
      const previousValue = value;
      value = removeCondition(value, path);
      logChange('removeCondition', { path }, previousValue);
      dispatchChange();
    },
    updateCondition: (path, condition) => {
      const previousValue = value;
      value = updateCondition(value, path, condition);
      logChange('updateCondition', { path, condition }, previousValue);
      dispatchChange();
    },
  });
</script>

<ConditionalTree {value} />
