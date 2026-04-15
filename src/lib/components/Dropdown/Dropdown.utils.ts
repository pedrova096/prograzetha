import type { Attachment } from 'svelte/attachments';
import type { DropdownOption } from './Dropdown.types';
import type { Props as TippyProps } from 'tippy.js';
import tippy from 'tippy.js';

export const getFilteredOptions = (
  searchQuery: string,
  options: DropdownOption[],
) => {
  const searchQueryTrimmed = searchQuery.trim().toLowerCase();
  if (!searchQueryTrimmed) return options;

  return options.filter((option) =>
    option.label.toLowerCase().includes(searchQueryTrimmed),
  );
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
