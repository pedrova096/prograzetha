<script lang="ts">
  import MentionInput from './MentionInput.svelte';
  import type { MentionInputOption } from './MentionInput.types';
  import { InputLiteralKind } from '../SidebarDrawer/ConditionalDrawer/ConditionalComposer/ConditionalTree/ConditionNode/ConditionNode.types';
  import { LITERAL_VARIANT_MAP } from '~/lib/constants';

  let message = $state('');

  const createVariableOption = (
    label: string,
    value: string,
    variant: InputLiteralKind,
  ): MentionInputOption => {
    const meta = LITERAL_VARIANT_MAP[variant];

    return {
      label,
      value,
      type: variant,
      icon: meta.svg,
      colorClass: meta.class,
      detail: meta.label,
    };
  };

  const options: MentionInputOption[] = [
    createVariableOption(
      'Nombre del cliente',
      'customer.name',
      InputLiteralKind.String,
    ),
    createVariableOption('Edad', 'customer.age', InputLiteralKind.Number),
    createVariableOption(
      'Cliente activo',
      'customer.isActive',
      InputLiteralKind.Boolean,
    ),
    createVariableOption(
      'Fecha de archivo',
      'customer.archivedAt',
      InputLiteralKind.Null,
    ),
  ];
</script>

<MentionInput
  bind:value={message}
  {options}
  trigger="$"
  placeholder="Escribe $ para insertar una variable..."
/>

<p class="mt-2 text-sm text-zinc-500">{message}</p>
