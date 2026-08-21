import type { Attachment } from 'svelte/attachments';
import type {
  DropdownEntry,
  DropdownOption,
  DropdownOptionGroup,
} from './Dropdown.types';
import type { Props as TippyProps } from 'tippy.js';
import tippy from 'tippy.js';

export const isOptionMatching = <T>(query: string, option: DropdownOption<T>) =>
  option.label.toLowerCase().includes(query);

export const isDropdownOptionGroup = <T>(
  entry: DropdownEntry<T>,
): entry is DropdownOptionGroup<T> => 'type' in entry && entry.type === 'group';

export const getFilteredEntries = <T>(
  searchQuery: string,
  entries: DropdownEntry<T>[],
): DropdownEntry<T>[] => {
  const searchQueryTrimmed = searchQuery.trim().toLowerCase();
  if (!searchQueryTrimmed) return entries;

  return entries.reduce<DropdownEntry<T>[]>((result, entry) => {
    if (isDropdownOptionGroup(entry)) {
      const newOptions = entry.options.filter((option) =>
        isOptionMatching(searchQueryTrimmed, option),
      );

      if (!newOptions.length) {
        return result;
      }
      return [...result, { ...entry, options: newOptions }];
    }

    if (isOptionMatching(searchQueryTrimmed, entry)) {
      return [...result, entry];
    }

    return result;
  }, []);
};

export const dropdown =
  <T extends HTMLElement>(
    options: Partial<Omit<TippyProps, 'interactive' | 'allowHTML'>>,
  ): Attachment<T> =>
  (element) => {
    const instance = tippy(element, {
      interactive: true,
      allowHTML: true,
      ...options,
    });

    return () => {
      instance.destroy();
    };
  };
