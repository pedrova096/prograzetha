import { getContext, setContext } from 'svelte';

import type { ConditionalComposerContextValue } from './ConditionalComposer.types';

const CONDITIONAL_COMPOSER_KEY = Symbol('SORTABLE_CONDITION_TREE');

export const setConditionalComposer = (
  value: ConditionalComposerContextValue,
) => {
  return setContext(CONDITIONAL_COMPOSER_KEY, value);
};

export const getConditionalComposer = () => {
  return getContext<ConditionalComposerContextValue>(CONDITIONAL_COMPOSER_KEY);
};
