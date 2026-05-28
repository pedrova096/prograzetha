import type { ConditionUnion } from '~/lib/modules/nodes';

export type ConditionalComposerChangedEvent = CustomEvent<{
  value: ConditionUnion;
  name: string;
}>;

export type ConditionalComposerProps = {
  name: string;
  value: ConditionUnion;
  onchange?: (event: ConditionalComposerChangedEvent) => void;
};

export type MoveConditionOptions = {
  fromPath: string;
  toPath: string;
  oldIndex: number;
  newIndex: number;
};

export type ConditionalComposerContextValue = {
  addConditionChild: (path: string, child: ConditionUnion) => void;
  moveCondition: (options: MoveConditionOptions) => void;
  removeCondition: (path: string) => void;
  updateCondition: (path: string, value: ConditionUnion) => void;
};
