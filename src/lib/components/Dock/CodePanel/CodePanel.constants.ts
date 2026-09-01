import javascriptIcon from './icons/javascript.svg';
import pythonIcon from './icons/python.svg';

import { JavaScript, Python } from '~/lib/modules/ir/languages';
import { CodeLanguage } from './CodePanel.types';
import { Code } from '@lucide/svelte';

export const LANGUAGE_OPTIONS = [
  {
    value: CodeLanguage.JavaScript,
    label: 'JavaScript',
    icon: javascriptIcon,
  },
  { value: CodeLanguage.Python, label: 'Python', icon: pythonIcon },
];

export const LANG_MODULE_MAP = {
  [CodeLanguage.Python]: Python,
  [CodeLanguage.JavaScript]: JavaScript,
};

export const CODE_ICON_LABEL = { icon: Code, label: 'Código' };
