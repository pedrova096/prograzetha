import { navigate } from 'svelte-routing';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

export const withBasePath = (pathname: string): string => {
  if (!pathname.startsWith('/')) return pathname;

  if (
    basePath &&
    (pathname === basePath || pathname.startsWith(`${basePath}/`))
  ) {
    return pathname;
  }

  return `${basePath}${pathname}`;
};

export const getAppPathname = (pathname: string): string => {
  if (
    basePath &&
    (pathname === basePath || pathname.startsWith(`${basePath}/`))
  ) {
    return pathname.slice(basePath.length) || '/';
  }

  return pathname;
};

export const navigateTo = (pathname: string): void => {
  navigate(withBasePath(pathname));
};
