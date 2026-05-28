import {
  EditorState,
  StateField,
  RangeSetBuilder,
  type ChangeSpec,
  type Extension,
  type Text,
  type Transaction,
} from '@codemirror/state';
import {
  Decoration,
  EditorView,
  WidgetType,
  type DecorationSet,
} from '@codemirror/view';
import type {
  Completion,
  CompletionContext,
  CompletionSource,
} from '@codemirror/autocomplete';
import type {
  MentionInputOption,
  ActiveMention,
  MentionInputConfig,
} from './MentionInput.types';

const MENTION_BOUNDARY_REGEX = /[\s,!?;:()[\]{}"'`<>/\\|]/;

export const getMentionOptionText = (option: MentionInputOption, key: string) =>
  String(option[key] ?? '');

const isMentionBoundary = (character: string) =>
  MENTION_BOUNDARY_REGEX.test(character);

const normalizeClassToken = (value: unknown) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-|-$/g, '');

const mentionCompletionOptions = new WeakMap<Completion, MentionInputOption>();

type MentionChangeSpec = {
  from: number;
  to: number;
  insert?: string | Text;
};

const createIconElement = (option: MentionInputOption, className: string) => {
  if (!option.icon) return null;

  const template = document.createElement('template');
  template.innerHTML = option.icon.trim();

  const icon = template.content.firstElementChild;
  if (!(icon instanceof SVGElement)) return null;

  icon.setAttribute(
    'class',
    [icon.getAttribute('class'), className].filter(Boolean).join(' '),
  );
  icon.setAttribute('aria-hidden', 'true');
  icon.setAttribute('focusable', 'false');

  return icon;
};

const renderMentionOptionIcon = (option: MentionInputOption) => {
  const iconContainer = document.createElement('span');
  iconContainer.className =
    'cm-mention-option-icon inline-flex size-5 shrink-0 items-center justify-center rounded border';

  if (option.colorClass) {
    iconContainer.className = `${iconContainer.className} ${option.colorClass}`;
  }

  const icon = createIconElement(option, 'size-3.5 shrink-0');
  if (icon) iconContainer.append(icon);

  return iconContainer;
};

class MentionWidget extends WidgetType {
  constructor(
    private readonly text: string,
    private readonly option: MentionInputOption,
  ) {
    super();
  }

  eq(widget: MentionWidget) {
    return (
      widget.text === this.text &&
      widget.option.value === this.option.value &&
      widget.option.label === this.option.label
    );
  }

  toDOM() {
    const wrapper = document.createElement('span');
    wrapper.className = [
      'cm-mention-token',
      this.option.colorClass,
      this.option.type &&
        `cm-mention-token-${normalizeClassToken(this.option.type)}`,
      this.option.className,
    ]
      .filter(Boolean)
      .join(' ');
    wrapper.title = this.option.label;

    const icon = createIconElement(
      this.option,
      'cm-mention-token-icon size-3.5 shrink-0',
    );
    if (icon) wrapper.append(icon);

    const label = document.createElement('span');
    label.textContent = this.text;
    wrapper.append(label);

    return wrapper;
  }

  ignoreEvent() {
    return false;
  }
}

const findActiveMention = (
  textBeforeCursor: string,
  trigger: string,
  minQueryLength: number,
): ActiveMention | null => {
  if (!trigger) return null;

  for (
    let index = textBeforeCursor.length - trigger.length;
    index >= 0;
    index -= 1
  ) {
    const currentCharacter = textBeforeCursor[index + trigger.length - 1];

    if (textBeforeCursor.slice(index, index + trigger.length) === trigger) {
      const query = textBeforeCursor.slice(index + trigger.length);

      if (query.length < minQueryLength) return null;
      if ([...query].some(isMentionBoundary)) return null;

      return {
        triggerFrom: index,
        queryFrom: index + trigger.length,
        query,
      };
    }

    if (isMentionBoundary(currentCharacter)) break;
  }

  return null;
};

const getFilteredMentionOptions = (
  options: MentionInputOption[],
  query: string,
  optionLabel: string,
  optionValue: string,
) => {
  const normalizedQuery = query.toLowerCase();

  return options.filter((option) => {
    const label = getMentionOptionText(option, optionLabel).toLowerCase();
    const value = getMentionOptionText(option, optionValue).toLowerCase();

    return label.includes(normalizedQuery) || value.includes(normalizedQuery);
  });
};

const getMentionRanges = (
  state: EditorState,
  options: MentionInputOption[],
  trigger: string,
  optionValue: string,
) => {
  const mentionOptionsByValue = new Set(
    options.map((option) => getMentionOptionText(option, optionValue)),
  );
  const docText = state.doc.toString();
  const escapedTrigger = trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const mentionRegex = new RegExp(`${escapedTrigger}([\\w.-]+)`, 'g');
  const ranges: Array<{ from: number; to: number }> = [];

  for (const match of docText.matchAll(mentionRegex)) {
    const mentionValue = match[1];

    if (!mentionOptionsByValue.has(mentionValue) || match.index === undefined) {
      continue;
    }

    ranges.push({ from: match.index, to: match.index + match[0].length });
  }

  return ranges;
};

const expandRangeToTouchedMentions = (
  range: { from: number; to: number },
  mentionRanges: Array<{ from: number; to: number }>,
) => {
  let expandedRange = { ...range };
  let changed = true;

  while (changed) {
    changed = false;

    for (const mentionRange of mentionRanges) {
      const overlapsMention =
        expandedRange.from < mentionRange.to &&
        expandedRange.to > mentionRange.from;
      const cursorInsideMention =
        expandedRange.from === expandedRange.to &&
        expandedRange.from > mentionRange.from &&
        expandedRange.from < mentionRange.to;

      if (!overlapsMention && !cursorInsideMention) {
        continue;
      }

      const nextRange = {
        from: Math.min(expandedRange.from, mentionRange.from),
        to: Math.max(expandedRange.to, mentionRange.to),
      };

      if (
        nextRange.from !== expandedRange.from ||
        nextRange.to !== expandedRange.to
      ) {
        expandedRange = nextRange;
        changed = true;
      }
    }
  }

  return expandedRange;
};

const mergeChangeRanges = (changes: MentionChangeSpec[]): ChangeSpec[] => {
  const sortedChanges = [...changes].sort((a, b) => a.from - b.from);
  const mergedChanges: MentionChangeSpec[] = [];

  for (const change of sortedChanges) {
    const previousChange = mergedChanges.at(-1);

    if (previousChange && change.from <= previousChange.to) {
      if ('insert' in previousChange || 'insert' in change) {
        mergedChanges.push(change);
        continue;
      }

      previousChange.to = Math.max(previousChange.to, change.to);
      continue;
    }

    mergedChanges.push(change);
  }

  return mergedChanges;
};

export const createMentionCompletionSource = ({
  options,
  trigger,
  minQueryLength,
  optionLabel,
  optionValue,
  filterOptions,
  formatInsertedValue,
}: MentionInputConfig): CompletionSource => {
  return (context: CompletionContext) => {
    const textBeforeCursor = context.state.doc.sliceString(0, context.pos);
    const activeMention = findActiveMention(
      textBeforeCursor,
      trigger,
      context.explicit ? 0 : minQueryLength,
    );

    if (!activeMention && !context.explicit) return null;

    const query = activeMention?.query ?? '';
    const completionFrom = activeMention?.queryFrom ?? context.pos;
    const replaceFrom = activeMention?.triggerFrom ?? context.pos;

    const filteredOptions = filterOptions
      ? filterOptions(options, query)
      : getFilteredMentionOptions(options, query, optionLabel, optionValue);

    return {
      from: completionFrom,
      to: context.pos,
      options: filteredOptions.map<Completion>((option) => {
        const value = getMentionOptionText(option, optionValue);
        const label = getMentionOptionText(option, optionLabel);

        const completion = {
          label,
          displayLabel: label,
          detail: option.detail ?? value,
          type: option.type ?? 'variable',
          apply(view) {
            const insertedValue = formatInsertedValue(option, trigger);
            const cursorPosition = replaceFrom + insertedValue.length;

            view.dispatch({
              changes: {
                from: replaceFrom,
                to: context.pos,
                insert: insertedValue,
              },
              selection: { anchor: cursorPosition },
            });
          },
        } satisfies Completion;

        mentionCompletionOptions.set(completion, option);

        return completion;
      }),
    };
  };
};

const buildMentionDecorations = (
  state: EditorState,
  options: MentionInputOption[],
  trigger: string,
  optionValue: string,
): DecorationSet => {
  const builder = new RangeSetBuilder<Decoration>();
  const mentionOptionsByValue = new Map(
    options.map((option) => [
      getMentionOptionText(option, optionValue),
      option,
    ]),
  );
  const docText = state.doc.toString();
  const escapedTrigger = trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const mentionRegex = new RegExp(`${escapedTrigger}([\\w.-]+)`, 'g');

  for (const match of docText.matchAll(mentionRegex)) {
    const mentionValue = match[1];
    const option = mentionOptionsByValue.get(mentionValue);

    if (!option || match.index === undefined) continue;

    builder.add(
      match.index,
      match.index + match[0].length,
      Decoration.replace({
        widget: new MentionWidget(match[0], option),
      }),
    );
  }

  return builder.finish();
};

export const mentionDecorations = (
  options: MentionInputOption[],
  trigger: string,
  optionValue: string,
): Extension =>
  StateField.define<DecorationSet>({
    create(state) {
      return buildMentionDecorations(state, options, trigger, optionValue);
    },
    update(decorations, transaction) {
      if (!transaction.docChanged) return decorations.map(transaction.changes);

      return buildMentionDecorations(
        transaction.state,
        options,
        trigger,
        optionValue,
      );
    },
    provide: (field) => EditorView.decorations.from(field),
  });

export const atomicMentionDeletion = (
  options: MentionInputOption[],
  trigger: string,
  optionValue: string,
): Extension =>
  EditorState.transactionFilter.of((transaction) => {
    if (!transaction.docChanged) return transaction;

    const mentionRanges = getMentionRanges(
      transaction.startState,
      options,
      trigger,
      optionValue,
    );

    const changes: MentionChangeSpec[] = [];
    let expandedSelectionAnchor: number | null = null;
    let expandedAnyRange = false;

    transaction.changes.iterChanges((fromA, toA, _fromB, _toB, inserted) => {
      const deletionRange = { from: fromA, to: toA };
      const expandedRange = expandRangeToTouchedMentions(
        deletionRange,
        mentionRanges,
      );
      const rangeWasExpanded =
        expandedRange.from !== deletionRange.from ||
        expandedRange.to !== deletionRange.to;

      if (inserted.length > 0) {
        if (rangeWasExpanded) {
          expandedAnyRange = true;
          expandedSelectionAnchor ??= expandedRange.from + inserted.length;
        }

        changes.push({
          from: expandedRange.from,
          to: expandedRange.to,
          insert: inserted,
        });
        return;
      }

      if (rangeWasExpanded) {
        expandedAnyRange = true;
        expandedSelectionAnchor ??= expandedRange.from;
      }

      changes.push(expandedRange);
    }, true);

    if (!expandedAnyRange) return transaction;

    const update = {
      changes: mergeChangeRanges(changes),
      selection: { anchor: expandedSelectionAnchor ?? 0 },
    };

    return update;
  });

export const mentionCompletionIconRenderer = {
  render(completion: Completion) {
    const option = mentionCompletionOptions.get(completion);
    if (!option?.icon) return null;

    return renderMentionOptionIcon(option);
  },
  position: 10,
};
