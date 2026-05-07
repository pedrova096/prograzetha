import {
  Play,
  Square,
  PencilLine,
  Megaphone,
  Split,
  Code,
  Repeat,
  type IconProps,
} from 'lucide-svelte';
import type { Component } from 'svelte';

import { NodeTypes } from '~/lib/modules/nodes';

export const TITLE_BY_TYPE = {
  [NodeTypes.Start]: 'Inicio',
  [NodeTypes.End]: 'Fin',
  [NodeTypes.Input]: 'Leer variable',
  [NodeTypes.Output]: 'Escribir',
  [NodeTypes.Condition]: 'Condición',
  [NodeTypes.Operation]: 'Operación',
  [NodeTypes.Loop]: 'Ciclo',
} satisfies Record<NodeTypes, string>;

export const ICON_BY_TYPE = {
  [NodeTypes.Start]: Play,
  [NodeTypes.End]: Square,
  [NodeTypes.Input]: PencilLine,
  [NodeTypes.Output]: Megaphone,
  [NodeTypes.Condition]: Split,
  [NodeTypes.Operation]: Code,
  [NodeTypes.Loop]: Repeat,
} satisfies Record<NodeTypes, unknown> as unknown as Record<
  NodeTypes,
  Component<IconProps>
>;
