import javascriptIcon from './icons/javascript.svg';
import pythonIcon from './icons/python.svg';

import { CodeLanguage } from './CodeDrawer.types';

export const LANGUAGE_OPTIONS = [
  {
    value: CodeLanguage.JavaScript,
    label: 'JavaScript',
    icon: javascriptIcon,
  },
  { value: CodeLanguage.Python, label: 'Python', icon: pythonIcon },
];
