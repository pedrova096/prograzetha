import tippy from 'tippy.js';
import type { Props as TippyProps } from 'tippy.js';
import type { Attachment } from 'svelte/attachments';

export const tooltip =
  <T extends HTMLElement>(options: Partial<TippyProps>): Attachment<T> =>
  (element) => {
    const instance = tippy(element, {
      allowHTML: true,
      interactive: true,
      ...options,
    });

    return () => {
      instance.destroy();
    };
  };
